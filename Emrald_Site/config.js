// Copyright 2021 Battelle Energy Alliance

var Configuration = (function () {
  function Configuration() {
    this.apiUrl = "http://localhost:60344/SimService";
    this.simInfo = { name: "EMRALD_Model3", desc: "", id: 3 }
    //this.apiUrl = "http://localhost:8020/SimService";
    //this.simInfo = { name: "", desc: "", id: 1 }
  }
  return Configuration;
})();

window.appConfig = new Configuration();

