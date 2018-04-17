[![Buimd status](https://travis-ci.org/WeScale/wescale-site.svg?branch=master)](https://travis-ci.org/WeScale/wescale-site)

# wescale-site
Our public site code


# Develop

```
docker run -ti -v$PWD:/srv/jekyll -p 4000:4000 jekyll/jekyll:3.5 jekyll server
```

Then Browse http://localhost:4000

# Deploy

```sh
aws s3 sync . s3://www.wescale.fr --region eu-west-1
```

Then Browse S3 bucket :

http://www.wescale.fr.s3-website-eu-west-1.amazonaws.com/

Modify the readme to force a rebuild
