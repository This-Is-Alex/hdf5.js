# HDF5 Typescript Exporter
This library allows you export an HDF5-compliant file in the web browser. This library works well with [jsfive](https://github.com/usnistgov/jsfive) which allows you to import an HDF5 file in the web browser.

Disclaimer: This HDF5 exporter is not based on the official C++ HDF5 library. It takes the data you provide and adds the bare minimum amount of data necessary to be a compliant HDF5 file. It does not support compression, and the resulting HDF5 file does not contain any empty space so is not suitable for subsequent modification after the initial creation.

# Getting started
The most basic setup is to create a single `Dataset` and giving it an array of data. This `Dataset` goes into a `DataGroup`, where an HDF5 file written by the `HDF5ExportFile` class can also contain multiple `DataGroup` objects.

## Dataset
A `Dataset` is the most atomic collection of data in HDF5. In this library you construct a `Dataset` with a name, the array of data, the dimensionality of the data and the data type of the array. Note that JavaScript handles numbers in memory as 64-bit floating point numbers. This has the downside of losing some precision if you need to export 64-bit integers using this library. A very basic `Dataset`:
```
const dataset = new Dataset("myFirstDataset",
    [10, 20], //the data array
    [1, 2], //dimensionality: 1x2
    Datatype.FLOAT64);
```
This results in a 1x2 array of 64-bit floating point numbers `[10, 20]`. A simple sanity check you might like to do in your code is ensure the length of the data array matches the dimensionality, i.e. `[10, 20]`'s length is 2, and the dataset's dimensionality is `[1, 2]` and 1 * 2 = 2.

## DataGroup
A `DataGroup` is a collection of `Dataset` objects. You could imagine this as putting files into a folder on your computer, though HDF5 uses different terminology.

If we take the dataset from the previous section's example, we can put it into a data group with only a couple lines of code:
```
const datagroup = new DataGroup("myDatagroup");
//define your dataset
datagroup.addDataset(dataset);
```

## Exporting DataGroups
Once you have a datagroup, exporting is easy!

Simply pass in an array of datagroups to the `HDF5ExportFile` class and call `.write()` and poof! You have the binary contents of an HDF5 file.
In code this looks like:
```
const datagroups = [datagroup];
const hdf5_exporter = new HDF5ExportFile(datagroups);
const arrayBuffer = hdf5_exporter.write();
```
You can have multiple datagroups in an HDF5 file, so the constructor expects an array.

Once you have the arraybuffer contents, you can do whatever you want with it. In most cases you will either want to upload it to a web server or download it as a local file. Here's a handy link to help you download the contents of your file in the browser: https://discourse.threejs.org/t/how-to-create-a-new-file-and-save-it-with-arraybuffer-content/628

# Using without TypeScript
If you need to use the library without typescript you can very quickly compile the library to JavaScript by running `npm install` and `npm run build`. Then the JavaScript library will be available in `dist/`.
