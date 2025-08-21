# BVP Scrapper

This short script will download the contents of Bessemer's Cloud Index website and extract the history of published revenue multiples. It outputs a JSON file (`bvp-history.json`) as follows:

```json
[
  {
    "date": "2013-08-21",
    "median": 4.75,
    "topQuartile": 6.61,
    "bottomQuartile": 4.1
  },
  ...
]
```

If the env var `AIRTABLE_SYNC` is set to `true`, the script will also push the most recent publication to Airtable.

## Requirements

- NodeJS (tested on v24.5.0).
- Yarn (tested in v1.22.22).
- Airtable API key (to use Airtable sync)

## Usage

```sh
node scrapper.js
```
