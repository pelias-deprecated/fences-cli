# fences

[![NPM](https://nodei.co/npm/fences.png)](https://nodei.co/npm/fences/)

Builds administrative boundary datasets

## requirements

#### `osmfilter` `osmconvert`

[`osmfilter`](http://wiki.openstreetmap.org/wiki/Osmfilter)
[`osmconvert`](http://wiki.openstreetmap.org/wiki/Osmconvert)

Ubuntu provides `osmfilter` and `osmconvert` in a package called `osmctools` which can be installed with
 
```bash
$ [sudo] apt-get install osmctools
```
Or you can build them as follows

```bash
$ wget -O - http://m.m.i24.cc/osmfilter.c | cc -x c - -O3 -o /usr/local/bin/osmfilter
$ wget -O - http://m.m.i24.cc/osmconvert.c | cc -x c - -lz -O3 -o /usr/local/bin/osmconvert
```

## install

```bash
$ npm install -g fences
```

## usage

```
fences [options] [command]

Commands:

    prep [options] <pbfFile> <outputFile>       extract all administrative boundaries into a new pbf file
    build <pbfFile> <outputDir>                 process an OSM file and generate geojson files for each admin_level of administrative boundaries
    slice <regionsFile> <inputDir> <outputDir>  slice all geojson files in inputDir into specified regions


Options:

    -h, --help  output usage information
```

### `prep`

Typically you would run prep on `planet-latest.pbf` before feeding it to the `build` script.
`prep` will intelligently filter the input file and preserve only administrative boundary relations and all their belonging members.
The original input file will not be changed. An output pbf file will be created in the specified location.

```
prep [options] <inputPBF> <outputPBF>

  extract all administrative boundaries into a new pbf file

  Options:

    -h, --help               output usage information
    -t, --tempDir <tempDir>  specify temp directory, defaults to /tmp/fences/

  Examples:

    $ fences prep /etc/data/planet-latest.pbf /etc/data/planet-filtered.pbf
    $ fences prep -t /tmp/otherDir /etc/data/planet-latest.pbf /etc/data/planet-filtered.pbf
```

### `build`

```
build [options] <inputFile> <outputDir>

  process an OSM file and generate geojson files for each admin_level of administrative boundaries

  Options:

    -h, --help  output usage information

  Examples:

    $ fences build /etc/data/planet-filtered.pbf /etc/data/planet-fences/
```

### `slice`

This script will generate region extracts from a given directory of geojson files.
Regions file should look something like this.

```javascript
{
  "regions": [
    {
     "name": "USA",
      "box": [-66.885444, 49.384358, -124.848974, 24.396308]
    }
  ]
}
```

```
slice [options] <regionsFile> <inputDir> <outputDir>

  slice all geojson files in inputDir into specified regions

  Options:

    -h, --help  output usage information

  Examples:

    $ fences slice /etc/data/regions.json /etc/data/planet-fences/ /etc/data/region-fences/
```

### create

This script will run all the other steps in the correct order: prep -> build -> slice and produce region extracts of `fences`

```
create [options] <inputPBF> <regionsFile> <outputDir>

  run fences creation process from start to finish (prep,build,slice)

  Options:

    -h, --help               output usage information
    -t, --tempDir <tempDir>  specify temp directory, defaults to /tmp/fences/

  Examples:

    $ fences create /etc/data/planet-latest.pbf /etc/data/regions.json /etc/data/region-fences/
```
