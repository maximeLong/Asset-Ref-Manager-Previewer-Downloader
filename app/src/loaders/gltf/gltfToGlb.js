//slightly tweaked version of https://github.com/sbtron/makeglb

export default function(el) {

  return new Promise(function (resolve) {

    var files=[];
    var fileblobs=[];
    var gltf;
    var remainingfilestoprocess=0;
    var glbfilename;
    var outputBuffers;
    var bufferMap;
    var bufferOffset;

    var dropZone = el;
    el.addEventListener('dragover', handleDragOver, false);
    el.addEventListener('drop', handleFileSelect, false);

    function handleDragOver(event) {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }

    function handleFileSelect(event) {
      event.stopPropagation();
      event.preventDefault();

      var items = event.dataTransfer.items;
      remainingfilestoprocess=items.length;
      for (var i=0; i<items.length; i++) {
        if (items[i].getAsEntry) {
        var entry = items[i].getAsEntry();
         } else if (items[i].webkitGetAsEntry) {
         var entry = items[i].webkitGetAsEntry();
        }
        if (entry) {
            traverseFileTree(entry);
        }
      }
    }

    function traverseFileTree(item, path) {
    path = path || "";
    if (item.isFile) {
      item.file(function(file) {
          files.push(file);
          var fileitem = '<li><strong>'+ escape(file.name)+ '</strong> ('+ file.type + ') - '+
                    file.size+ ' bytes, last modified: '+ file.lastModifiedDate +
                    '</li>';
          var extension = file.name.split('.').pop();
          if ( extension === "gltf")
            {
              glbfilename=file.name.substr(file.name.lastIndexOf('/')+1,file.name.lastIndexOf('.'));
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
              gltf = JSON.parse(event.target.result);
              checkRemaining();
              };
          }
          else{
            var reader = new FileReader();
            reader.onload = (function(theFile) {
            return function(e) {
            fileblobs[theFile.name.toLowerCase()]=(e.target.result);
            checkRemaining();
            };
          })(file);
          reader.readAsArrayBuffer(file);
        }
      },function(error){
          console.log(error);
      });
    } else if (item.isDirectory) {
      var dirReader = item.createReader();
      dirReader.readEntries(function(entries) {
          remainingfilestoprocess+=entries.length;
          checkRemaining();
        for (var i=0; i<entries.length; i++) {
          traverseFileTree(entries[i], path + item.name + "/");
        }
      });
    }
  }

  function checkRemaining(){
      remainingfilestoprocess--;
      if(remainingfilestoprocess===0){
        outputBuffers = [];
        bufferMap = new Map();
        bufferOffset = 0;
        processBuffers().then(fileSave);
      }
  }

  function processBuffers(){
    var pendingBuffers = gltf.buffers.map(function (buffer, bufferIndex) {
      return dataFromUri(buffer)
        .then(function(data) {
          if (data !== undefined) {
            outputBuffers.push(data);
          }
          delete buffer.uri;
          buffer.byteLength = data.byteLength;
          bufferMap.set(bufferIndex, bufferOffset);
          bufferOffset += alignedLength(data.byteLength);
        });
    });
    return Promise.all(pendingBuffers)
      .then(function() {
          var bufferIndex = gltf.buffers.length;
          var images = gltf.images || [];
          var pendingImages = images.map(function (image) {
            return dataFromUri(image).then(function(data) {
              if (data === undefined) {
                  delete image['uri'];
                  return;
              }
              var bufferView = {
                  buffer: 0,
                  byteOffset: bufferOffset,
                  byteLength: data.byteLength,
              };
              bufferMap.set(bufferIndex, bufferOffset);
              bufferIndex++;
              bufferOffset += alignedLength(data.byteLength);
              var bufferViewIndex = gltf.bufferViews.length;
              gltf.bufferViews.push(bufferView);
              outputBuffers.push(data);
              image['bufferView'] = bufferViewIndex;
              image['mimeType'] = getMimeType(image.uri);
              delete image['uri'];
            });
          });
          return Promise.all(pendingImages);
      });
  }
  function fileSave(){
      var Binary = {
          Magic: 0x46546C67
      };
      for (var _i = 0, _a = gltf.bufferViews; _i < _a.length; _i++) {
          var bufferView = _a[_i];
          if(bufferView.byteOffset=== undefined){
              bufferView.byteOffset=0;
          }
          else{
          bufferView.byteOffset = bufferView.byteOffset + bufferMap.get(bufferView.buffer);
        }
          bufferView.buffer = 0;
      }
      var binBufferSize = bufferOffset;
      gltf.buffers = [{
          byteLength: binBufferSize
      }];
      var enc = new TextEncoder();
      var jsonBuffer = enc.encode(JSON.stringify(gltf));
      var jsonAlignedLength = alignedLength(jsonBuffer.length);
      var padding;
      if (jsonAlignedLength !== jsonBuffer.length) {
          padding = jsonAlignedLength- jsonBuffer.length;
      }
      var totalSize = 12 + // file header: magic + version + length
          8 + // json chunk header: json length + type
          jsonAlignedLength +
          8 + // bin chunk header: chunk length + type
          binBufferSize;
      var finalBuffer = new ArrayBuffer(totalSize);
      var dataView = new DataView(finalBuffer);
      var bufIndex = 0;
      dataView.setUint32(bufIndex, Binary.Magic, true);
      bufIndex += 4;
      dataView.setUint32(bufIndex, 2, true);
      bufIndex += 4;
      dataView.setUint32(bufIndex, totalSize, true);
      bufIndex += 4;
      // JSON
      dataView.setUint32(bufIndex, jsonAlignedLength, true);
      bufIndex += 4;
      dataView.setUint32(bufIndex, 0x4E4F534A, true);
      bufIndex += 4;
      for (var j=0;j<jsonBuffer.length;j++){
          dataView.setUint8(bufIndex, jsonBuffer[j]);
          bufIndex++;
      }
      if(padding!==undefined){
          for (var j=0;j<padding;j++){
              dataView.setUint8(bufIndex, 0x20);
          bufIndex++;
      }
      }
      // BIN
      dataView.setUint32(bufIndex, binBufferSize, true);
      bufIndex += 4;
      dataView.setUint32(bufIndex, 0x004E4942, true);
      bufIndex += 4;
      for (var i = 0; i < outputBuffers.length; i++) {
        var bufoffset = bufIndex + bufferMap.get(i);
        var buf = new Uint8Array(outputBuffers[i]);
        var thisbufindex=bufoffset;
        for (var j=0;j<buf.byteLength;j++){
          dataView.setUint8(thisbufindex, buf[j]);
          thisbufindex++;
      }
      }

      var file = new Blob([finalBuffer],{type: 'model/json-binary'})
      file.lastModifiedDate = new Date();
      file.name = glbfilename+".glb";

      // var a = document.createElement("a");
      // document.body.appendChild(a);
      // a.style = "display: none";
      // a.href = URL.createObjectURL(file);
      // a.download = glbfilename+".glb";
      // a.click();

      resolve(file);

  }
  function isBase64(uri) {
      return uri.length < 5 ? false : uri.substr(0, 5) === "data:";
  }
  function decodeBase64(uri) {
      return fetch(uri).then(function(response) { return response.arrayBuffer(); });
  }
  function dataFromUri(buffer) {
      if (buffer.uri === undefined) {
        return Promise.resolve(undefined);
      } else if (isBase64(buffer.uri)) {
        return decodeBase64(buffer.uri);
      } else {
        var filename=buffer.uri.substr(buffer.uri.lastIndexOf('/')+1);
        return Promise.resolve(fileblobs[filename.toLowerCase()]);
      }
  }
  function alignedLength(value) {
      var alignValue = 4;
      if (value == 0) {
          return value;
      }
      var multiple = value % alignValue;
      if (multiple === 0) {
          return value;
      }
      return value + (alignValue - multiple);
  }
  function getMimeType(filename) {
      for (var mimeType in gltfMimeTypes) {
          for (var extensionIndex in gltfMimeTypes[mimeType]) {
              var extension = gltfMimeTypes[mimeType][extensionIndex];
              if (filename.toLowerCase().endsWith('.' + extension)) {
                  return mimeType;
              }
          }
      }
      return 'application/octet-stream';
  }
  var gltfMimeTypes = {
      'image/png': ['png'],
      'image/jpeg': ['jpg', 'jpeg'],
      'text/plain': ['glsl', 'vert', 'vs', 'frag', 'fs', 'txt'],
      'image/vnd-ms.dds': ['dds']
  };

  })
}
