export class Dataset {
  name: string;
  data: any[];
  dimensions: number[];
  datatype: Datatype;

  /**
   * Construct a dataset
   * @param name Name of the dataset (e.g. "data")
   * @param data Array of the actual data this represents
   * @param dimensions Array of the size in each dimension. Length of this array represents the number of dimensions
   * @param datatype The type of data from the Datatype enum
   */
  constructor(name, data, dimensions, datatype) {
    this.name = name;
    this.data = data;
    this.dimensions = dimensions;
    this.datatype = datatype;
  }

  write(arrayBuffer: ArrayBuffer, offset: number): number {
    //TODO write Data object and appropriate headers
    return this.writeRawData(arrayBuffer, offset);
  }

  writeRawData(arrayBuffer: ArrayBuffer, offset: number): number {
    const dataView = new DataView(arrayBuffer);
    let offset2 = 0;
    for (const object of this.data) {
      offset2 += this._writeOneRawData(dataView, offset + offset2, object);
    }
    return offset2;
  }

  _writeOneRawData(dataView: DataView, offset: number, rawdata: any): number {
    switch (this.datatype) {
      case Datatype.INT8:
        dataView.setInt8(offset, rawdata);
        return 1;
      case Datatype.UINT8:
        dataView.setUint8(offset, rawdata);
        return 1;
      case Datatype.INT16:
        dataView.setInt16(offset, rawdata, true);
        return 2;
      case Datatype.UINT16:
        dataView.setUint16(offset, rawdata, true);
        return 2;
      case Datatype.INT32:
        dataView.setInt32(offset, rawdata, true);
        return 4;
      case Datatype.UINT32:
        dataView.setUint32(offset, rawdata, true);
        return 4;
      case Datatype.INT64:
        dataView.setBigInt64(offset, rawdata, true);
        return 8;
      case Datatype.UINT64:
        dataView.setBigUint64(offset, rawdata, true);
        return 8;
      case Datatype.FLOAT64:
        dataView.setFloat64(offset, rawdata, true);
        return 8;
      case Datatype.STRING:
        for (let i = 0; i < (rawdata as string).length; i++) {
          dataView.setUint8(offset + i, (rawdata as string).charCodeAt(i));
        }
        dataView.setUint8(offset + (rawdata as string).length, 0); //null terminator
        return (rawdata as string).length + 1;
      default:
        return 0;
    }
  }

  getLength(): number {
    //TODO add headers
    return this.getLengthOfRawData();
  }

  getLengthOfRawData(): number {
    switch (this.datatype) {
      case Datatype.INT8:
      case Datatype.UINT8:
        return this.data.length;
      case Datatype.INT16:
      case Datatype.UINT16:
        return this.data.length * 2;
      case Datatype.INT32:
      case Datatype.UINT32:
        return this.data.length * 4;
      case Datatype.INT64:
      case Datatype.UINT64:
      case Datatype.FLOAT64:
        return this.data.length * 8;
      default:
        break;
    }
    if (this.datatype == Datatype.STRING) {
      let total = 0;
      for (const value of this.data as string[]) {
        total += value.length;
        total += 1; //null terminator
      }
      return total;
    } else {
      return 0;
    }
  }
}

export enum Datatype {
  INT8,
  UINT8,
  INT16,
  UINT16,
  INT32,
  UINT32,
  INT64,
  UINT64,
  FLOAT64,
  STRING
}