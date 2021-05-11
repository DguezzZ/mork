function log(message){
  var textarea = document.getElementById('logs');
  textarea.value += message;
  textarea.value += '\n';
  textarea.scrollTop = textarea.scrollHeight;
}

function generateProject(){

  var inputElement = document.getElementById('projectname')
  if(inputElement.validity.patternMismatch){
    log("ERROR: Invalid project name. Check that it starts with an Uppercase letter followed by any alphanumeric characters or underscores");
    return;
  }
  var correctName = inputElement.value;

  log("Starting generation for project " + correctName);

  // CONFIGURATION
  var domain = 'https://raw.githubusercontent.com/rmartinsanta/mork/web/template/';
  var urls = [
    {folder: '', name: 'pom.xml'},
    {folder: 'src/main/resources', name: 'application.yml'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__', name: 'Main.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/constructives', name: '__RNAME__RandomConstructive.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/constructives/grasp', name: '__RNAME__ListManager.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/experiments', name: 'ConstructiveExperiment.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__Instance.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__InstanceImporter.java'},
    {folder: 'src/main/java/es/urjc/etsii/grafo/__RNAME__/model', name: '__RNAME__Solution.java'}
  ];

  var zip = new JSZip();
  var count = 0;
  var mark = '__RNAME__';
  var decoder = new TextDecoder("utf-8");
  var encoder = new TextEncoder(); // Defaults to UTF-8

  urls.forEach(function(url){
    // loading a file and add it in a zip file
    var fullURL = domain + url.folder + '/' + url.name;
    var fullURL = fullURL.replaceAll('//', '/');

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
            log("Generation done for project " + correctName);
            log("DONE!");
         });
      }
    });
  });
}