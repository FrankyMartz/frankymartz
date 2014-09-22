#!/usr/bin/env bash
################################################################################
# title:        _deploy.sh
# description:  Sync Jekyll Static Site to AWS S3
# author:       Franky Martinez <frankymartz@gmail.com>
# date:         09-08-2014
# version:      1.0.0
################################################################################
set -e -u


#===============================================================================
# Configuration
#===============================================================================
BASE_DIR=$(cd $(dirname $0) && pwd)
BUCKET='s3://frankymartz.com/'
SITE_DIR="./public/"
# TEST SYNCRONIZATION
DRY_RUN=true


#===============================================================================
# Logging - SUCCESS, WARNING, ERROR
#===============================================================================
log() {
    local normal=$(tput sgr0)
    local green=$(tput setaf 2)
    local yellow=$(tput setaf 3)
    local red=$(tput setaf 1)

    if [[ "$#" -eq 2 ]]; then
        case "$1" in
            green )
                echo -ne "$green$2$normal"
                ;;
            yellow )
                echo -ne "$yellow$2$normal"
                ;;
            red )
                echo -ne "$red$2$normal"
                ;;
            * )
                echo -ne "$2"
                ;;
        esac
    else
        echo "$(tput smul)${red}Error$(tput rmul): Expected 2 arguments, got $#${normal}" >&2
    fi
}

#===============================================================================
# S3CMD - HOT SAUCE
#===============================================================================
# 31536000
log 'green' "==> AWS: Start Bucket RSync\n"

#= CSS =========================================================================
log 'green' "==> Uploading CSS\n"
# Cache Expire: 1 year
aws --color "on" s3 sync $SITE_DIR $BUCKET --dryrun $DRY_RUN --delete true --exclude "*.*" --include "*.css" --acl "public-read" --content-type 'text/css' --cache-control 'max-age=31536000' --content-encoding 'gzip'


#= JS ==========================================================================
log 'green' "==> Uploading JavaScript\n"
## Cache Expire: 1 year
aws --color "on" s3 sync $SITE_DIR $BUCKET --dryrun $DRY_RUN --delete true --exclude "*.*" --include "*.js" --acl "public-read" --content-type 'application/javascript' --cache-control 'max-age=31536000' --content-encoding 'gzip'


##= MEDIA =======================================================================
log 'green' "==> Uploading media (png, jpg, svg, gif, ico)\n"
## Cache Expire: 10 weeks
aws --color "on" s3 sync $SITE_DIR $BUCKET --dryrun $DRY_RUN --delete true --exclude "*.*" --include "*.png" --include "*.jpg" --include "*.svg" --include "*.gif" --include "*.ico" --acl "public-read" --cache-control 'max-age=6048000' --expires 'Sat, 20 Nov 2020 18:46:39 GMT'


##= HTML ========================================================================
log 'green' "==> Uploading HTML\n"
## Cache Expire: 2 hours
aws --color "on" s3 sync $SITE_DIR $BUCKET --dryrun $DRY_RUN --delete true --exclude "*.*" --include "*.html" --acl "public-read" --content-type 'text/html' --cache-control 'max-age=7200, must-revalidate' -content-encoding 'gzip' --content-language "en-US"


##= OTHER =======================================================================
log 'green' "==> Syncronize everything else\n"
aws --color "on" s3 sync $SITE_DIR $BUCKET --dryrun $DRY_RUN --delete true --include "*.*" --exclude "*.html" --exclude "*.css" --exclude "*.js" --exclude "*.png" --exclude "*.jpg" --exclude "*.svg" --exclude "*.gif" --exclude "*.ico" --acl "public-read"

##===============================================================================

log 'green' "==> AWS: Complete\n"
