const mockedData = require('../model/mockeddata');


function getRTUs() {
    return mockedData.rtus.map((rtu) => rtu.name);
  }
  
  // Function to get the points associated with an RTU
  function getPointsByRTU(rtuName) {
    const foundRTU = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    console.log("vikad" + foundRTU);

    return foundRTU ? foundRTU.points : [];
  }
  
  // Function to get the number of points associated with an RTU
  function getPointCount(rtuName) {
    const foundRTU = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    return foundRTU ? foundRTU.points.length : 0;
  }
  
  // Function to get the value of a point
  function getPointValue(rtuName, pointName) {
    const foundRTU = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (foundRTU) {
      const foundPoint = foundRTU.points.find((point) => point.name === pointName);
      if (foundPoint) {
        return foundPoint.value;
      }
    }
    return null;
  }
  
  // Function to get the timestamp of the last value change
  function getLastValueChangeTimestamp(rtuName, pointName) {
    const foundRTU = mockedData.rtus.find((rtu) => rtu.name === rtuName);
    if (foundRTU) {
      const foundPoint = foundRTU.points.find((point) => point.name === pointName);
      if (foundPoint) {
        return foundPoint.timestamp;
      }
    }
    return null;
  }
  
  module.exports = {
    getRTUs,
    getPointsByRTU,
    getPointCount,
    getPointValue,
    getLastValueChangeTimestamp,
  };
  