document.getElementById('upload').addEventListener('change', handleFileSelect, false);

// recuperation fichier
var ExcelToJSON = function () {
  this.parseExcel = function (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary',
      });
      workbook.SheetNames.forEach(function (sheetName) {
        /**
         * XL_row_object = objet qui represente le tableau de la page xls
         */
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        /**
         * questionArray = contient l'ensemble des objets sous le bon format
         */
        var questionArray = [];
        XL_row_object.forEach((row) => {
          /**
          * listAnswers = contient l'ensemble des reponses. La reponse en index 0 est toujours la bonne
          */
          var listAnswers = [];
          if ((row.goodAnswer !== undefined) && row.goodAnswer !== null) {
            listAnswers.push(row.goodAnswer);

            if ((row.badAnswer1 !== undefined) && row.badAnswer1 !== null) {
              listAnswers.push(row.badAnswer1);
            }
            if ((row.badAnswer2 !== undefined) && row.badAnswer2 !== null) {
              listAnswers.push(row.badAnswer2);
            }
            /**
           * questionObject = formatte un objet correspondant aux questions et reponses
           */
            var questionObject = {
              question: row.question,
              answers: listAnswers,
              difficulty: row.difficultyLevel,
              bonneReponse: row.goodAnswer,
            };
            if (questionObject.question !== undefined) {
              questionArray.push(questionObject);
            }
          }
        });
        var json_object = JSON.stringify(questionArray);
        console.log(JSON.parse(json_object));
        jQuery('#xlx_json').val(json_object);
      });
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
  var { files } = evt.target; // FileList object
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
}
