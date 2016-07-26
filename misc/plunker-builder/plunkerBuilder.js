'use strict';

let _ = require('lodash');
let globby = require('globby');
let fse = require('fs-extra');
let jsdom = require('jsdom');
let path = require('path');

let demoFilesPath = `${__dirname}/demo-files`;
let copyrights = {};
let demoFiles = {};

function addMissingFiles(config, postData) {
  const existingFiles = config.fileNames.map((file) => getFileFromPath(file));

  _.forEach(demoFiles, (content, fileName) => {
    const fileWithoutPath = getFileFromPath(fileName);
    if (existingFiles.indexOf(fileWithoutPath) === -1) {
      postData[`files[${fileName}]`] = content;
    }
  });
}

function buildPlunkers(examplesPath) {
  getDemoFiles(demoFilesPath);
  const plunkerPaths = path.join(examplesPath, '**/*plnkr.json');
  const fileNames = globby.sync(plunkerPaths);
  fileNames.forEach((configFileName) => {
    try {
      buildPlunkerFrom(configFileName, examplesPath);
    } catch (e) {
      console.error(e);
    }
  });
}

function buildPlunkerFrom(configFileName, examplesPath) {
  // replace ending 'plnkr.json' with 'plnkr.html' to create output file name
  const outputFileName = configFileName.substr(0, configFileName.length - 'plnkr.json'.length) + 'plnkr.html';
  try {
    const config = initConfigAndCollectFileNames(configFileName);
    const postData = createPostData(config);
    addMissingFiles(config, postData);
    const html = createPlunkerHtml(postData);
    fse.writeFileSync(outputFileName, html, 'utf-8');
  } catch (e) {
    if (existsSync(outputFileName)) {
      fse.unlinkSync(outputFileName);
    }
    throw e;
  }
}

function createBasePlunkerHtml(useNewWindow) {
  var url = 'http://plnkr.co/edit/?p=preview';
  // If the form posts to target="_blank", pop-up blockers can cause it not to work.
  // If a user choses to bypass pop-up blocker one time and click the link, they will arrive at
  // a new default plnkr, not a plnkr with the desired template.  Given this undesired behavior,
  // some may still want to open the plnk in a new window by opting-in via ctrl+click.  The
  // newWindow param allows for this possibility.
  const target = useNewWindow ? '_blank' : '_self';
  let html = '<!DOCTYPE html><html lang="en"><body>'
  html += `<form id="mainForm" method="post" action="${url}" target="${target}">`
  html +=  '</form><script>document.getElementById("mainForm").submit();</script>'
  html += '</body></html>';
  return html;
}

function createPlunkerHtml(postData) {
  const baseHtml = createBasePlunkerHtml(false);
  const doc = jsdom.jsdom(baseHtml);
  const form = doc.querySelector('form');
  _.forEach(postData, (value, key) => {
    let ele = htmlToElement(doc, `<input type="hidden" name="${key}">`);
    ele.setAttribute('value', value);
    form.appendChild(ele);
  });
  return doc.documentElement.outerHTML;
}

function createPostData(config) {
  let postData = {};
  let content;
  config.fileNames.forEach(function(fileName) {
    var extn = path.extname(fileName);
    if (extn === '.png') {
      content = encodeBase64(fileName);
      fileName = fileName.substr(0, fileName.length - 4) + '.base64.png';
    } else {
      content = fse.readFileSync(fileName, 'utf-8');
    }

    let relativeFileName = path.relative(config.basePath, fileName);

    if (relativeFileName === config.main) {
      relativeFileName = 'index.html';
    }

    if (relativeFileName === 'index.html') {
      if (config.description === null) {
        // set config.description to title from index.html
        const matches = /<title>(.*)<\title>/.exec(content);
        if (matches) {
          config.description = matches[1];
        }
      }
    }

    postData[`files[app/${relativeFileName}]`] = content;
  });

  const tags = ['angular2', 'bootstrap'].concat(config.tags || []);
  tags.forEach((tag, ix) => postData[`tags[${ix}]`] = tag);

  postData.private = true;

  postData.description = `ng-bootstrap example - ${config.description}`;
  return postData;
}

function encodeBase64(file) {
  const bitmap = fse.readFileSync(file);

  return new Buffer(bitmap).toString('base64');
}

function existsSync(filename) {
  try {
    fs.accessSync(filename);
    return true;
  } catch(ex) {
    return false;
  }
}

function getDemoFiles(demoFilesPath, filePath) {
  filePath = filePath ? `${filePath}/` : '';
  fse.readdirSync(demoFilesPath).map((file) => {
    if (fse.lstatSync(`${demoFilesPath}/${file}`).isDirectory()) {
      getDemoFiles(`${demoFilesPath}/${file}`, file);
    } else {
      demoFiles[`${filePath}${file}`] = fse.readFileSync(`${demoFilesPath}/${file}`);
    }
  });
}

function getFileFromPath(file) {
  return file.substr(file.lastIndexOf('/') + 1);
}

function htmlToElement(document, html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

function initConfigAndCollectFileNames(configFileName) {
  const basePath = path.dirname(configFileName);
  const configSrc = fse.readFileSync(configFileName, 'utf-8');
  let config;
  try {
    config = (configSrc && configSrc.trim().length) ? JSON.parse(configSrc) : {};
  } catch (e) {
    throw new Error(`Plunker config - unable to parse json file: ${configFileName}\n ${e}`);
  }
  const defaultIncludes = ['**/*.ts', '**/*.js', '**/*.css', '**/*.html', '**/*.md', '**/*.json', '**/*.png'];
  if (config.files) {
    if (config.files.length > 0) {
      if (config.files[0].substr(0, 1) === '!') {
        config.files = defaultIncludes.concat(config.files);
      }
    }
  } else {
    config.files = defaultIncludes;
  }
  let gpaths = config.files.map(function(fileName) {
    fileName = fileName.trim();
    if (fileName.substr(0, 1) === '!') {
      return `!${path.join(basePath, fileName.substr(1))}`;
    } else {
      return path.join(basePath, fileName);
    }
  });
  const defaultExcludes = [
    '!**/*plnkr.*'
  ];
  Array.prototype.push.apply(gpaths, defaultExcludes);

  config.fileNames = globby.sync(gpaths);
  config.basePath = basePath;

  return config;
}

module.exports = {
  buildPlunkers: buildPlunkers
};
