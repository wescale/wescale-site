# wescale-site
Our public site code


# Develop

```
docker run -ti -v./:/srv/jekyll -p 4000:4000 jekyll/jekyll
```

Then Browse http://localhost:4000

# Deploy

```sh
aws s3 sync . s3://www.wescale.fr --region eu-west-1
```

Then Browse S3 bucket :

http://www.wescale.fr.s3-website-eu-west-1.amazonaws.com/

