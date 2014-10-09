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
base_dir=$(cd $(dirname $0) && pwd)
script=$(basename ${BASH_SOURCE[0]})
bucket='s3://frankymartz.com/'
site_dir="./public/"
script_version="1.1.0"
dryrun=""

#===  FUNCTION  ================================================================
#         NAME:  log
#  DESCRIPTION:  success, warning, error
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

#===  FUNCTION  ================================================================
#         NAME:  usage
#  DESCRIPTION:  Display usage information.
#===============================================================================
usage() {
cat <<- EOF

    Usage:      $0 [options]
    Version:    ${script_version}

    Options:
    -d  Execute without server push
    -h  Display this message
    -v  Display script version

EOF
}


#-----------------------------------------------------------------------
#  Handle command line arguments
#-----------------------------------------------------------------------

while getopts ":dhv" opt; do
    case $opt in

        d|dryrun   )
            dryrun="--dryrun"
            break
            ;;

        h|help     )
            usage
            exit 0
            ;;

        v|version  )
            echo "$0 -- Version $script_version"
            exit 0
            ;;

        \? )
            echo -e "\n  Option does not exist : $OPTARG\n"
            usage
            exit 1
            ;;

    esac
done
shift $(($OPTIND-1))


#===============================================================================
# S3CMD - HOT SAUCE
#===============================================================================
# 31536000
log 'green' "==> AWS: Start Bucket RSync\n"

#= CSS =========================================================================
log 'green' "==> Uploading CSS\n"
# Cache Expire: 1 year
aws --color "on" s3 sync $dryrun $site_dir $bucket --delete --exclude "*.*" --include "*.css" --acl "public-read" --content-type 'text/css' --cache-control 'max-age=31536000' --content-encoding 'gzip'


#= JS ==========================================================================
log 'green' "==> Uploading JavaScript\n"
## Cache Expire: 1 year
aws --color "on" s3 sync $dryrun $site_dir $bucket --delete --exclude "*.*" --include "*.js" --acl "public-read" --content-type 'application/javascript' --cache-control 'max-age=31536000' --content-encoding 'gzip'


##= MEDIA ======================================================================
log 'green' "==> Uploading media (png, jpg, svg, gif, ico)\n"
## Cache Expire: 1 year
aws --color "on" s3 sync $dryrun $site_dir $bucket --delete --exclude "*.*" --include "*.png" --include "*.jpg" --include "*.svg" --include "*.gif" --include "*.ico" --acl "public-read" --cache-control 'max-age=31536000' --expires 'Sat, 20 Nov 2020 18:46:39 GMT'


##= HTML =======================================================================
log 'green' "==> Uploading HTML\n"
## Cache Expire: none
aws --color "on" s3 sync $dryrun $site_dir $bucket --delete --exclude "*.*" --include "*.html" --acl "public-read" --content-type 'text/html' --cache-control 'no-cache, no-store, must-revalidate' --content-encoding 'gzip' --content-language "en-US"
## Cache Expire: 15 minutes
# aws --color "on" s3 sync $site_dir $bucket --delete --exclude "*.*" --include "*.html" --acl "public-read" --content-type 'text/html' --cache-control 'max-age=900, must-revalidate' --content-encoding 'gzip' --content-language "en-US"

##= OTHER ======================================================================
log 'green' "==> Syncronize everything else\n"
aws --color "on" s3 sync $dryrun $site_dir $bucket --delete --include "*.*" --exclude "*.html" --exclude "*.css" --exclude "*.js" --exclude "*.png" --exclude "*.jpg" --exclude "*.svg" --exclude "*.gif" --exclude "*.ico" --acl "public-read"

##==============================================================================

log 'green' "==> AWS: Complete\n"

