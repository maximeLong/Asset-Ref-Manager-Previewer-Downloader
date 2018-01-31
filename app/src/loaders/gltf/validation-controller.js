const SEVERITY_MAP = ['Errors', 'Warnings', 'Infos', 'Hints'];
const validator = require("./gltfValidator");

export default {

  validate (rootFile, rootPath, fileMap) {
    const rootFileURL = typeof rootFile === 'string'
      ? rootFile
      : URL.createObjectURL(rootFile);

    return fetch(rootFileURL)
      .then((response) => response.arrayBuffer())
      .then((buffer) => validator.validateBytes(new Uint8Array(buffer)))
      .then((report) => this.setReport(report))
      .catch((e) => this.setReportException(e));
  }

  setReport (report) {
    report.issues.maxSeverity = -1;
    SEVERITY_MAP.forEach((severity, index) => {
      if (report.issues[`num${severity}`] > 0 && report.issues.maxSeverity === -1) {
        report.issues.maxSeverity = index;
      }
    });
    report.errors = report.issues.messages.filter((msg) => msg.severity === 0);
    report.warnings = report.issues.messages.filter((msg) => msg.severity === 1);
    report.infos = report.issues.messages.filter((msg) => msg.severity === 2);
    report.hints = report.issues.messages.filter((msg) => msg.severity === 3);

    console.log(report);
  }

  setReportException (e) {
    console.log(e);
  }

}
