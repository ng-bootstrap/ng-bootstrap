// This loader is used to remove from bootstrap during the e2e-app build
// the :lang(en) selector that causes a warning.
module.exports = function (file) {
	return file.replace(/:lang\(en\)/g, '');
};
