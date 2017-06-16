# Ervell

Front-end Are.na client, built using Artsy's [Ezel](https://github.com/artsy/ezel). Also made possible by Artsy's very generous decision to open source their front-end client. Many patterns (also bits of code, probably) adopted from [Force](https://github.com/artsy/force-public). Thanks dudes.

The general idea here is something minimal, utilitarian, unobtrusive and adaptible to many different situations. We try to make use of re-usable components and views as often as possible.

* * *

### Local installation

```bash
  git clone git@github.com:arenahq/ervell.git
  cd ervell
  npm install
  gem install foreman
```

### Running the server

```bash
  foreman start -f Procfile.dev -e .env.dev
  # => Listening on port 5000
```

-----

## Deploy staging

```
make deploy-staging branch=branch
```

(This doesn't work.)
