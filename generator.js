function log(message){
  var textarea = document.getElementById('logs');
  textarea.value += message;
  textarea.value += '\n';
  textarea.scrollTop = textarea.scrollHeight;
}

// Copy pasted from https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function setTags(){
  var selector = document.getElementById('morktag')
  getJSON('https://api.github.com/repos/rmartinsanta/mork/tags', function(status, data){
    console.log("Github tags API response:")
    console.log(data);
    const filtered_data = [];
    for(var i = 0; i < data.length; i++){
      const name = data[i].name;
      if(name.indexOf("parent") != -1){
        filtered_data.push(data[i]);
      }
    }
    console.log(filtered_data)
    for(var i = 0; i < filtered_data.length; i++){
      const name = filtered_data[i].name;

      const displayName = name.replaceAll("mork-parent-", "");
      const selected = i == 0;
      selector.add(new Option(displayName, name, selected, selected));
    }
  });
}

function generateProject(){

  var inputElement = document.getElementById('projectname')
  if(inputElement.validity.patternMismatch){
    log("ERROR: Invalid project name. Check that it starts with an Uppercase letter followed by any alphanumeric characters or underscores (no spaces please!)");
    return;
  }
  var tag = document.getElementById('morktag').value;
  var correctName = inputElement.value;

  log("Starting generation for project " + correctName);

  // CONFIGURATION
  var domain = 'https://raw.githubusercontent.com/rmartinsanta/mork/'+tag+'/template/';
  var urls = [
    {folder: '', name: 'pom.xml'},
    {folder: '', name: '.gitignore'},
    {folder: 'instances', name: '.keep'},
    {folder: 'docker', name: 'Dockerfile'},
    {folder: 'docker', name: 'build.sh'},
    {folder: 'docker', name: 'run.sh'},
    {folder: 'docker', name: 'publish.sh'},
    {folder: 'src/main/resources', name: 'application.yml'},
    {folder: 'src/main/resources/static', name: 'app.js'},
    {folder: 'src/main/resources/static', name: 'index.html'},
    {folder: 'src/main/resources/static', name: 'main.css'},
    {folder: 'src/main/resources/irace', name: 'middleware.sh'},
    {folder: 'src/main/resources/irace', name: 'forbidden.txt'},
    {folder: 'src/main/resources/irace', name: 'parameters.txt'},
    {folder: 'src/main/resources/irace', name: 'runner.R'},
    {folder: 'src/main/resources/irace', name: 'scenario.txt'},
    {folder: 'src/main/resources/META-INF', name: 'additional-spring-configuration-metadata.json'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__', name: 'Main.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/constructives', name: '__RNAME__RandomConstructive.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/constructives/grasp', name: '__RNAME__ListManager.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/experiments', name: 'ConstructiveExperiment.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__Instance.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__InstanceImporter.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__Solution.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__SolutionValidator.java'},
    {folder: '.run', name: 'Performance.run.xml'},
    {folder: '.run', name: 'Validation.run.xml'}
  ];

  var zip = new JSZip();
  var count = 0;
  var mark = '__RNAME__';
  var decoder = new TextDecoder("utf-8");
  var encoder = new TextEncoder(); // Defaults to UTF-8

  urls.forEach(function(url){
    // loading a file and add it in a zip file
    var path = url.folder + '/' + url.name;
    var path = path.replaceAll('//', '/');
    var fullURL = domain + path;

    JSZipUtils.getBinaryContent(fullURL, function (err, data) {
      log("Downloading " + fullURL);
       if(err) {
         log("Error found while downloading " + fullURL);
         log(err);
         throw err;
       }
       var realFolder = url.folder.replaceAll(mark, correctName);
       var realFilename = url.name.replaceAll(mark, correctName);
       var decodedContent = decoder.decode(data);
       var realContent = decodedContent.replaceAll(mark, correctName);
       zip.folder(realFolder).file(realFilename, encoder.encode(realContent), {binary:true});
       count++;
       if (count == urls.length) {
         log("Generating ZIP file");
         zip.generateAsync({type:'blob'}).then(function(content) {
            log("ZIP created, saving...");
            saveAs(content, correctName + ".zip");
            log("DONE!");
         });
      }
    });
  });
}

setTags();
