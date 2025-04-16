class Utils {
    static _caseInsensitiveEquals(name1, name2) {
        return name1.trim().toLowerCase() === name2.trim().toLowerCase();
    }

    /**
     * Tries to convert value to the best string representation
     * Convert is not 100% complete yet, just tries to cover most common cases
     */
    static _convertToString(value) {
        if (typeof value === "string" || value instanceof String) {
            return value;
        } else if (typeof value === "number" || typeof value === "boolean") {
            return value.toString();
        } else if (value instanceof Date) {
            let dateTimeString = value.toISOString();
            return dateTimeString.slice(0, dateTimeString.lastIndexOf('.'));
        }
        return JSON.stringify(value);
    }

    /**
     * Tries to convert value to the type
     * Convert is not 100% complete yet, just tries to cover most common cases
     */
    static _convertFromString(value, type) {
        if (type === "STRING") {
            return value;
        } else if (type === "DATE_TIME") {
            return new Date(value);
        }
        return JSON.parse(value);
    }
}

class FullScreenUtils {
    static isFullScreenEnabled() {
        return document.fullscreenEnabled || document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled || document.msFullscreenEnabled;
    }

    static isFullScreen() {
        return document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement;
    }

    static requestFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    static cancelFullScreen() {
        if (document.cancelFullScreen) { // Standard API
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) { // Chrome and Safari
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE
            document.msExitFullscreen();
        }
    }

    static toggleFullScreen(id) {
        if (FullScreenUtils.isFullScreen()) {
            FullScreenUtils.cancelFullScreen();
        } else {
            let element = document.getElementById(id);
            FullScreenUtils.requestFullScreen(element);
        }
    }
}

class Inputs  {
    constructor(modelVersion, experiment) {
        this.modelVersion = modelVersion;
        this.outputs = modelVersion.experimentTemplate.outputs;
        this._setInputs(experiment);
    }

    getInput(name) {
        let input = this._findInput(name);
        this._checkInput(input, name);
        return Utils._convertFromString(input.value, input.type);
    }

    setInput(name, value) {
        let input = this._findInput(name);
        this._checkInput(input, name);
        input.value = Utils._convertToString(value, input.type);
    }

    setNumberOfReplications(value) {
        const name = "{NUMBER_OF_REPLICATIONS}";
        this._addNumberOfReplicationsInputIfAbsent(name, value)
        this.setInput(name, value);
    }

    setRangeInput(name, min, max, step) {
        let input = this._findInput(name);
        this._checkInput(input, name);
        if (input.type === "INTEGER") {
            input.type = "FIXED_RANGE_INTEGER";
            min = ~~min;
            max = ~~max;
            step = ~~step;
        } else if (input.type === "DOUBLE") {
            input.type = "FIXED_RANGE_DOUBLE";
        } else if (input.type !== "FIXED_RANGE_INTEGER" && input.type !== "FIXED_RANGE_DOUBLE") {
            throw new Error(`Input parameter "${name}" is not numeric, so range input is not available for it`);
        }
        input.value =`{"min":${min},"max":${max},"step":${step}}`;
    }

    _findInput(name) {
        return this.inputsArray.find(i => Utils._caseInsensitiveEquals(i.name, name));
    }

    _checkInput(input, name) {
        if (!input) throw new Error(`Input parameter "${name}" not found`);
    }

    _addNumberOfReplicationsInputIfAbsent(name) {
        let input = this._findInput(name);
        if (!input) {
            this._addNumberOfReplicationsInput(name);
        }
    }

    _addNumberOfReplicationsInput(name) {
        const numberOfReplications = {
            name,
            type: "INTEGER",
            units: null,
            value: "3"
        };
        this.inputsArray.push(numberOfReplications);
    }

    _setInputs(experiment) {
        if (experiment) {
            this.inputsArray = experiment.inputs.map(i => Object.assign({}, i));
        } else {
            this.inputsArray = this.modelVersion.experimentTemplate.inputs.map(i => Object.assign({}, i));
            this.inputsArray.push({name: "{RANDOM_SEED}", type: "LONG", units: null, value: "1"});
        }
        this.inputsArray.sort((a, b) => {
            if (b.name > a.name) return -1;
            if (b.name < a.name) return 1;
            return 0;
        });
    }

    _getData(type) {
        return {
            inputs: this.inputsArray,
            experimentType: type
        };
    }

    _clone() {
        let newInputs = new Inputs(this.modelVersion);
        newInputs.inputsArray = this.inputsArray.map(i => Object.assign({}, i));
        return newInputs;
    }
}

class SingleRunOutputs {
    constructor(outputs) {
        this.outputs = outputs;
    }

    names() {
        return this.outputs.map(i => i.name);
    }

    findNameIncluding(namePart) {
        let names = this.outputs
            .map(o => o.name)
            .filter(n => n.toLowerCase().includes(namePart.toLowerCase().trim()));
        if (names.length === 0) throw new Error(`No output names including "${namePart}" part found`);
        if (names.length > 1) throw new Error(`Multiple output names including "${namePart}" part found`);
        return names[0];
    }

    value(name) {
        let output = this.outputs.find(i => Utils._caseInsensitiveEquals(i.name, name));
        if (!output) throw new Error(`Output value "${name}" not found`);
        return output.value;
    }

    getRawOutputs() {
        return this.outputs;
    }
}

class MultiRunOutputs {
    constructor(resultData) {
        const inputsArray = resultData.find(d => d.inputs.length > 0);
        this.inputNames = inputsArray ? inputsArray.inputs.map(d => d.name) : [];

        this.inputsList = inputsArray ? JSON.parse(inputsArray.value) : [];

        this.outputColumns = resultData
            .filter(d => d.outputs.length > 0)
            .map(d => ({ name: d.outputs[0].name, value: JSON.parse(d.value) }));

        this.outputNames = this.outputColumns.map(e => e.name);

        this.outputsList = [];
        let n = this.outputColumns[0].value.length;
        for (let i = 0; i < n; i++) {
            let values = [];
            for (let j = 0; j < this.outputColumns.length; j++) {
                values[j] = this.outputColumns[j].value[i];
            }
            this.outputsList[i] = values;
        }

        this.rawData = [];
        this.rawData.push(this.inputNames.concat(this.outputNames));
        for (let i = 0; i < this.inputsList.length; i++) {
            this.rawData.push(this.inputsList[i].concat(this.outputsList[i]));
        }
    }

    getInputNames() {
        return this.inputNames;
    }

    getOutputNames() {
        return this.outputNames;
    }

    getValuesOfInput(name) {
        let index = this.inputNames.findIndex(n => Utils._caseInsensitiveEquals(n, name));
        if (index === -1) throw new Error(`Input "${name}" not found or was not varied`);
        return this.inputsList.map(inputs => inputs[index]);
    }

    getValuesOfOutput(name) {
        let index = this.outputNames.findIndex(n => Utils._caseInsensitiveEquals(n, name));
        if (index === -1) throw new Error(`Output "${name}" not found`);
        return this.outputColumns[index].value;
    }

    getRawData() {
        return this.rawData;
    }
}

class Animation {
    constructor(cloudClient, svgClient, inputs, info) {
        this.cloudClient = cloudClient;
        this.svgClient = svgClient;
        this.inputs = inputs;
        this.info = info;
        this.nodeUrl = `${this.cloudClient.HOST_URL}/nodes/${this.info.restUrl}sessions/${this.info.sessionUuid}`;
        this.version = ALVersion.fromString(info.version);
    }

    stop() {
        this.svgClient.stop("STOPPED");
        this.cloudClient._apiRequest(`${this.nodeUrl}/stop`, "POST");
        if (this.onStopped)
            this.onStopped(this);
    }

    pause() {
        let url = `${this.nodeUrl}/command?cmd=pause&parameters=`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    resume() {
        let url = `${this.nodeUrl}/command?cmd=run&parameters=`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    setSpeed(speed) {
        let url = `${this.nodeUrl}/command?cmd=setspeed&parameters=${speed}`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    setVirtualTime() {
        let url = `${this.nodeUrl}/command?cmd=setspeed&parameters=Infinity`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    navigateTo(viewArea) {
        let url = `${this.nodeUrl}/command?cmd=navigateto&parameters=${viewArea}`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    setPresentable(pathToPresentable) {
        let url = `${this.nodeUrl}/command?cmd=setpresentable&parameters=${pathToPresentable}`;
        return this.cloudClient._apiRequest(url, "POST")
            .then(() => this);
    }

    setValue(pathToField, value) {
        if (this.version.greaterOrEquals(this.cloudClient.VERSION_SUPPORTING_EXTENDED_ANIMATION_API)) {
            let url = `${this.nodeUrl}/set-value?pathtofield=${pathToField}`;
            return this.cloudClient._apiRequest(url, "POST", { data: Utils._convertToString(value) })
                .then(() => this);
        } else {
            throw new Error(this._versionDoesNotSupportMessage("Set value"));
        }
    }

    getValue(pathToField) {
        if (this.version.greaterOrEquals(this.cloudClient.VERSION_SUPPORTING_EXTENDED_ANIMATION_API)) {
            let url = `${this.nodeUrl}/get-value?pathtofield=${pathToField}`;
            return this.cloudClient._apiRequest(url, "GET")
                .then(r => {
                    return JSON.parse(JSON.parse(r)); // Due to double serialization on server side
                });
        } else {
            throw new Error(this._versionDoesNotSupportMessage("Get value"));
        }
    }

    getState() {
        if (this.version.greaterOrEquals(this.cloudClient.VERSION_SUPPORTING_EXTENDED_ANIMATION_API)) {
            let url = `${this.nodeUrl}/get-state`;
            return this.cloudClient._apiRequest(url, "GET")
                .then(r => {
                    return JSON.parse(JSON.parse(r)); // Due to double serialization on server side
                });
        } else {
            throw new Error(this._versionDoesNotSupportMessage("Get state"));
        }
    }

    callFunction(pathToFunction, args) {
        if (this.version.greaterOrEquals(this.cloudClient.VERSION_SUPPORTING_EXTENDED_ANIMATION_API)) {
            let url = `${this.nodeUrl}/call-function?pathtofunction=${pathToFunction}`;
            return this.cloudClient._apiRequest(url, "POST", {
                data: JSON.stringify(args.map(a => JSON.stringify(a)))
            }).then(r => {
                return JSON.parse(JSON.parse(r)); // Due to double serialization on server side
            });
        } else {
            throw new Error(this._versionDoesNotSupportMessage("Call function"));
        }
    }

    waitForCompletion() {
        return new Promise(resolve => {
            this.onStopped = resolve;
        });
    }

    _versionDoesNotSupportMessage(methodName) {
        return `${methodName} is not supported by models made with AnyLogic version ${this.version}, ${this.cloudClient.VERSION_SUPPORTING_EXTENDED_ANIMATION_API} required`;
    }
}

class ModelRun {

    constructor(client, inputs, modelVersion, type) {
        this.client = client;
        this.inputs = inputs._clone();
        this.modelVersion = modelVersion;
        this.type = type;
        this.versionsUrl = this.client.OPEN_API_URL + "/versions/" + this.modelVersion.id;
    }

    run() {
        return this.client._apiRequest(this.versionsUrl + "/runs", "POST", this._getRequestParams())
            .then(() => this);
    }

    waitForCompletion(pollingPeriod) {
        if (!pollingPeriod) pollingPeriod = 5000;
        return this._pollResults(pollingPeriod);
    }

    stop() {
        return this.client._apiRequest(this.versionsUrl + "/runs/stop", "POST", this._getRequestParams())
            .then(() => this);
    }

    getStatus() {
        return this.runState.status;
    }

    getProgress() {
        if (this.runState) {
            return Promise.resolve(this.runState.message === "" ? undefined : JSON.parse(this.runState.message));
        } else {
            return this.client._apiRequest(this.versionsUrl + "/run", "POST", this._getRequestParams())
                .then(runState => {
                    return runState.message === "" ? undefined : JSON.parse(runState.message);
                });
        }
    }

    getOutputsAndRunIfAbsent(requiredOutputNames, pollingPeriod) {
        return this.getOutputs(requiredOutputNames)
            .catch(error => {
                if (error.status === 404) {
                    return this.run()
                        .then(() => this.waitForCompletion(pollingPeriod))
                        .then(() => this.getOutputs(requiredOutputNames));
                } else {
                    throw error;
                }
            });
    }

    getOutputs(requiredOutputNames) {
        return this._getRunResults(this.runState, requiredOutputNames);
    }

    _pollResults(pollingPeriod) {
        return this.client._apiRequest(this.versionsUrl + "/run", "POST", this._getRequestParams())
            .then(runState => {
                this.runState = runState;
                switch (runState.status) {
                    case "FRESH":
                    case "RUNNING":
                        return new Promise(resolve => setTimeout(() => resolve(this._pollResults(pollingPeriod)), pollingPeriod));
                    case "COMPLETED":
                        return Promise.resolve(this);
                    case "ERROR":
                    case "STOPPED":
                        return Promise.reject(runState.status);
                    default:
                        // Unexpected status
                        break;
                }
            });
    }

    _getRunResults(runState, requiredOutputNames) {
        switch (this.type) {
            case "SIMULATION":
                return this._getSimulationRunResults(runState, requiredOutputNames);
            case "PARAMETER_VARIATION":
                return this._getVariationRunResults(runState, requiredOutputNames);
            case "MONTE_CARLO":
                return this._getMonteCarloRunResults(runState, requiredOutputNames);
            default:
                throw Error(`Unknown type of experiment "${this.type}"`);
        }
    }

    _getSimulationRunResults(runState, requiredOutputNames) {
        let aggregations = this._filterRequiredOutputs(requiredOutputNames)
            .map(output => {
                return {
                    aggregationType: "IDENTITY",
                    inputs: [],
                    outputs: [output]
                }
            });

        return this._makeRequestForResults(aggregations, runState).then(result => {
            let outputsList = result.map(r => Object.assign(
                {}, r.outputs[0], {value: Utils._convertFromString(r.value, r.outputs[0].type)})
            );
            return new SingleRunOutputs(outputsList);
        });
    }

    _getVariationRunResults(runState, requiredOutputNames) {
        let aggregations = this._filterRequiredOutputs(requiredOutputNames)
            .map(output => {
                return {
                    aggregationType: "ARRAY",
                    inputs: [],
                    outputs: [output]
                }
            });
        let variableInputs = this.inputs.inputsArray
            .filter(i => i.type === "FIXED_RANGE_INTEGER" || i.type === "FIXED_RANGE_DOUBLE");
        aggregations.push({
            aggregationType: "ARRAY",
            inputs: variableInputs,
            outputs: []
        });

        return this._makeRequestForResults(aggregations, runState).then(result => {
            return new MultiRunOutputs(result);
        });
    }

    _getMonteCarloRunResults(runState, requiredOutputNames) {
        let aggregations = this._filterRequiredOutputs(requiredOutputNames)
            .map(output => {
                return {
                    aggregationType: "HISTOGRAM_DATA",
                    inputs: [],
                    outputs: [output]
                }
            });
        /*let variableInputs = this.inputs.inputsArray
            .filter(i => i.type === "DOUBLE" || i.type === "INTEGER" || i.type === "LONG");
        aggregations.push({
            aggregationType: "HISTOGRAM_DATA",
            inputs: variableInputs,
            outputs: []
        });*/

        return this._makeRequestForResults(aggregations, runState).then(result => {
            return new MultiRunOutputs(result);
        });
    }

    _makeRequestForResults(aggregations, runState) {
        if (runState) {
            return this.client._apiRequest(`${this.versionsUrl}/results/${runState.id}`, "POST",
                {data: JSON.stringify(aggregations), contentType: "application/json"});
        } else {
            let resultsRequest = this.inputs._getData(this.type);
            resultsRequest.outputs = JSON.stringify(aggregations);
            return this.client._apiRequest(`${this.versionsUrl}/results`, "POST",
                {data: JSON.stringify(resultsRequest), contentType: "application/json"});
        }
    }

    _filterRequiredOutputs(requiredOutputNames) {
        if (requiredOutputNames) {
            return requiredOutputNames.map(name => {
                let output = this.inputs.outputs.find(o => Utils._caseInsensitiveEquals(o.name, name))
                if (!output) throw new Error(`Output value "${name}" not found`);
                return output;
            });
        } else {
            switch (this.type) {
                case "SIMULATION":
                    return this.inputs.outputs;
                case "PARAMETER_VARIATION":
                    return this.inputs.outputs.filter(output => this._isScalarType(output.type));
                case "MONTE_CARLO":
                    return this.inputs.outputs.filter(output => this._isHistogramType(output.type));
                default:
                    throw Error(`Unknown type of experiment "${this.type}"`);
            }
        }
    }

    _isScalarType(type) {
        return type === "BOOLEAN" ||
            type === "INTEGER" ||
            type === "LONG" ||
            type === "DOUBLE" ||
            type === "STRING" ||
            type === "DATE_TIME"
    }

    _isHistogramType(type) {
        return type === "DOUBLE" ||
            type === "INTEGER" ||
            type === "DATA_SET"
    }

    _getRequestParams() {
        return {
            data: JSON.stringify(this.inputs._getData(this.type)),
            contentType: "application/json"
        };
    }
}

class CloudClient {
    static create(apiKey, host) {
        return new CloudClient(apiKey, host ? host : "https://cloud.anylogic.com");
    }

    constructor(apiKey, host) {
        this.VERSION = "8.5.0";
        this.SERVER_VERSION = "8.5.0";
        this.VERSION_SUPPORTING_EXTENDED_ANIMATION_API = new ALVersion(8, 5, 0);
        this.apiKey = apiKey;
        this._setHost(host);
    }

    getModels() {
        return this._apiRequest(this.OPEN_API_URL + "/models");
    }

    getModelById(id) {
        return this._apiRequest(this.OPEN_API_URL + "/models/" + id);
    }

    getModelByName(name) {
        return this._apiRequest(this.OPEN_API_URL + "/models/name/", "POST",
            {
                data: JSON.stringify(name),
                contentType: "application/json"
            });
    }

    getModelVersionById(model, versionId) {
        return this._apiRequest(this.OPEN_API_URL + "/models/" + model.id + "/versions/" + versionId);
    }

    getModelVersionByNumber(model, versionNumber) {
        return this._apiRequest(this.OPEN_API_URL + "/models/" + model.id + "/versions/number/" + versionNumber);
    }

    _getOutputFile(hash, filename) {
        const url = this.OPEN_API_URL + "/output-file/" + this._formatGETParams({hash, filename});

        return this._apiRequest(url, "GET");
    }

    _readUploadFile(file) {
        const reader = new FileReader();
        const promise = new Promise((resolve) =>
            reader.onload = () => resolve(reader.result)
        );
        reader.readAsArrayBuffer(file);

        return promise;
    }

    getFileHash(file) {
        return this._readUploadFile(file)
            .then((content) => {
                const h = new Hash().update(new Uint8Array(content));
                const digest = h.digest();
                h.clean();

                return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');
            });
    }

    fileExistsByHash(hash) {
        return this._apiRequest(this.OPEN_API_URL + "/check-file/" + this._formatGETParams({hash}));
    }

    uploadFile(input) {
        return this.getFileHash(input.files[0])
            .then((hashcode) =>
                this.fileExistsByHash(hashcode)
                    .then((cachedHash) => !cachedHash ?
                        this._apiRequest(this.OPEN_API_URL + "/upload-file/", "POST", {data: {file: input.value}}) :
                        new Promise((resolve) => resolve(hashcode))
                    ));
    }

    downloadFile(outputValue) {
        const [hash, fileName] = [outputValue.hash, outputValue.localPath];

        if (!hash && !fileName) {
            return false;
        }

        cloudClient._getOutputFile(hash, fileName)
            .then((url) => cloudClient._startDowload(url, fileName));
    }

    _startDowload(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        if (fileName) {
            link.download = fileName;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link.remove();
    }

    createDefaultInputs(version) {
        return new Inputs(version);
    }

    createInputsFromExperiment(version, experimentName) {
        return this._getModelVersionExperiments(version)
            .then(experiments => {
                const experiment = experiments.find(e => e.name === experimentName);
                if (!experiment) {
                    throw new Error(`There is no experiment with name "${experimentName}" in version ${version.version}`);
                }
                return new Inputs(version, experiment);
            });
    }

    createSimulation(inputs) {
        return this._createModelRun(inputs, "SIMULATION");
    }

    createParameterVariation(inputs) {
        return this._createModelRun(inputs, "PARAMETER_VARIATION");
    }

    createMonteCarloFirstOrder(inputs) {
        return this._createModelRun(inputs, "MONTE_CARLO");
    }

    getLatestModelVersion(model) {
        if (typeof model === 'string' || model instanceof String) {
            return this.getModelByName(model)
                .then(m => this._getLatestModelVersion(m));
        } else {
            return this._getLatestModelVersion(model);
        }
    }

    startAnimation(inputs, divId) {
        let requestData = {
            data: JSON.stringify({
                inputs: inputs.inputsArray,
                experimentType: "ANIMATION_SVG"
            }),
            contentType: "application/json"
        };
        let cloudClient = this;

        return this._apiRequest(this.OPEN_API_URL + "/versions/" + inputs.modelVersion.id + "/runs/animation", "POST", requestData).then(info => {
            const bundleUrl = `${info.bundleUrl}/standalone/`;
            const host = this.HOST_URL;
            const responseInfo = { ...info, bundleUrl, host };
            this._setBaseTag(bundleUrl);

            return this._loadAnimation(responseInfo, divId).then(() => {
                const svgClient = window.AnimationSVG.client;
                const animation = new Animation(cloudClient, svgClient, inputs, responseInfo);
                if (FullScreenUtils.isFullScreenEnabled()) {
                    svgClient.setCallback("ontogglefullscreen", () => FullScreenUtils.toggleFullScreen("svg-video-container"));
                }
                svgClient.setCallback("onstop", () => animation.stop());
                svgClient.start(responseInfo);
                return Promise.resolve(animation);
            });
        });
    }

    _getModelVersionExperiments(modelVersion) {
        return this._apiRequest(this.OPEN_API_URL + "/versions/" + modelVersion.id + "/experiments");
    }

    _getLatestModelVersion(model) {
        let versionId = model.modelVersions[model.modelVersions.length - 1];
        return this.getModelVersionById(model, versionId);
    }

    _setHost(host) {
        this.HOST_URL = host;
        this.REST_URL = this.HOST_URL + "/api";
        this.OPEN_API_URL = this.REST_URL + "/open/" + this.SERVER_VERSION;
    }

    _createModelRun(inputs, type) {
        return new ModelRun(this, inputs, inputs.modelVersion, type);
    }

    _formatGETParams( params ){
        return "?" + Object
            .keys(params)
            .map(function(key){
                return key+"="+encodeURIComponent(params[key])
            })
            .join("&")
    }

    _apiRequest(url, type, params, noAuth) {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            if (!type) type = "GET";
            if (!params) params = {};
            xhttp.open(type, url, true);
            if (params.contentType)
                xhttp.setRequestHeader("Content-Type", params.contentType);
            if (!noAuth)
                xhttp.setRequestHeader("Authorization", this.apiKey);
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        let result = xhttp.responseText;
                        if (!params.responseType)
                            result = JSON.parse(result);
                        resolve(result);
                    } else {
                        if (!params.responseType) {
                            reject(JSON.parse(this.responseText));
                        } else {
                            reject(this.status);
                        }
                    }
                }
            };
            xhttp.send(params.data);
        });
    }

    async _loadAnimation(info, id) {
        const url = info.bundleUrl;
        const srcScript = `${url}standalone.bundle.js`;
        const srcStyle = `${url}standalone.min.css`;

        await Promise.all([
            this._loadStyle(srcStyle),
            this._loadContentToDiv(url, id)
        ]);
        return this._loadScript(srcScript);
    }

    _loadStyle(src) {
        return new Promise((resolve, reject) => {
            const linkElement = document.createElement("link");
            linkElement.rel  = "stylesheet";
            linkElement.href = src;
            linkElement.onload = () => resolve();
            linkElement.onerror = () => reject(src);
            document.head.appendChild(linkElement);
        });
    }

    _loadScript(src) {
        return new Promise((resolve, reject) => {
            const scriptElement = document.createElement("script");
            scriptElement.type = "text/javascript";
            scriptElement.src = src;
            scriptElement.async = true;
            scriptElement.onload = () => resolve();
            scriptElement.onerror = () => reject(src);
            document.body.appendChild(scriptElement);
        });
    }

    _loadContentToDiv(url, id) {
        const srcHTML = `${url}assets/svg-template.html`;
        return this._apiRequest(srcHTML, "GET", {responseType: "text"}, true).then(content => {
            content = content.replace(/(href=['"])(assets)/g, "$1" + url + "/$2");
            document.getElementById(id).innerHTML = content;
        });
    }

    _setBaseTag(bundleUrl) {
        const head = document.head;
        const base = document.createElement('base');
        base.href = bundleUrl;
        head.insertBefore(base, head.firstChild);
    }
}

class ALVersion {

    constructor(major, minor, extra) {
        if (major === undefined || minor === undefined || extra === undefined) {
            throw new Error("Illegal argument");
        }
        this.major = major;
        this.minor = minor;
        this.extra = extra;
    }

    compare(other) {
        let res;
        res = this.major - other.major;
        if(res !== 0) { return res; }
        res = this.minor - other.minor;
        if(res !== 0) { return res; }
        res = this.extra - other.extra;
        return res;
    }

    between(obj1, obj2) {
        return this.compare(obj1) >= 0 && this.compare(obj2) <= 0;
    }

    greaterOrEquals(obj1) {
        return this.compare(obj1) >= 0;
    }

    static fromString(version) {
        let numbers = version.split(".");
        let major = Number(numbers[0]);
        let minor = Number(numbers[1]);
        let extra = Number(numbers[2]);
        return new ALVersion(major, minor, extra);
    }

    toString() {
        return `${this.major}.${this.minor}.${this.extra}`;
    }
}

// Hash implements SHA256 hash algorithm.
class Hash {
    digestLength = 32;
    blockSize = 64;

    _K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
        0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
        0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
        0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
        0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
        0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
        0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
        0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
        0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
        0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    // Note: Int32Array is used instead of Uint32Array for performance reasons.
    _state = new Int32Array(8); // hash state
    _temp = new Int32Array(64); // temporary state
    _buffer = new Uint8Array(128); // buffer for data to hash
    _bufferLength  = 0; // number of bytes in buffer
    _bytesHashed = 0; // number of total bytes hashed

    finished = false; // indicates whether the hash was finalized

    constructor() {
        this.reset();
    }

    // Resets hash state making it possible
    // to re-use this instance to hash other data.
    reset() {
        this._state[0] = 0x6a09e667;
        this._state[1] = 0xbb67ae85;
        this._state[2] = 0x3c6ef372;
        this._state[3] = 0xa54ff53a;
        this._state[4] = 0x510e527f;
        this._state[5] = 0x9b05688c;
        this._state[6] = 0x1f83d9ab;
        this._state[7] = 0x5be0cd19;
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this.finished = false;
        return this;
    }

    // Cleans internal buffers and re-initializes hash state.
    clean() {
        for (let i = 0; i < this._buffer.length; i++) {
            this._buffer[i] = 0;
        }
        for (let i = 0; i < this._temp.length; i++) {
            this._temp[i] = 0;
        }
        this.reset();
    }

    // Updates hash state with the given data.
    //
    // Optionally, length of the data can be specified to hash
    // fewer bytes than data.length.
    //
    // Throws error when trying to update already finalized hash:
    // instance must be reset to use it again.
    update(data, dataLength = data.length) {
        if (this.finished) {
            throw new Error("SHA256: can't update because hash was finished.");
        }
        let dataPos = 0;
        this._bytesHashed += dataLength;
        if (this._bufferLength > 0) {
            while (this._bufferLength < 64 && dataLength > 0) {
                this._buffer[this._bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this._bufferLength === 64) {
                this._hashBlocks(this._temp, this._state, this._buffer, 0, 64);
                this._bufferLength = 0;
            }
        }
        if (dataLength >= 64) {
            dataPos = this._hashBlocks(this._temp, this._state, data, dataPos, dataLength);
            dataLength %= 64;
        }
        while (dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    }

    // Finalizes hash state and puts hash into out.
    //
    // If hash was already finalized, puts the same value.
    finish(out) {
        if (!this.finished) {
            const bytesHashed = this._bytesHashed;
            const left = this._bufferLength;
            const bitLenHi = (bytesHashed / 0x20000000) | 0;
            const bitLenLo = bytesHashed << 3;
            const padLength = (bytesHashed % 64 < 56) ? 64 : 128;

            this._buffer[left] = 0x80;
            for (let i = left + 1; i < padLength - 8; i++) {
                this._buffer[i] = 0;
            }
            this._buffer[padLength - 8] = (bitLenHi >>> 24) & 0xff;
            this._buffer[padLength - 7] = (bitLenHi >>> 16) & 0xff;
            this._buffer[padLength - 6] = (bitLenHi >>>  8) & 0xff;
            this._buffer[padLength - 5] = (bitLenHi >>>  0) & 0xff;
            this._buffer[padLength - 4] = (bitLenLo >>> 24) & 0xff;
            this._buffer[padLength - 3] = (bitLenLo >>> 16) & 0xff;
            this._buffer[padLength - 2] = (bitLenLo >>>  8) & 0xff;
            this._buffer[padLength - 1] = (bitLenLo >>>  0) & 0xff;

            this._hashBlocks(this._temp, this._state, this._buffer, 0, padLength);

            this.finished = true;
        }

        for (let i = 0; i < 8; i++) {
            out[i * 4 + 0] = (this._state[i] >>> 24) & 0xff;
            out[i * 4 + 1] = (this._state[i] >>> 16) & 0xff;
            out[i * 4 + 2] = (this._state[i] >>>  8) & 0xff;
            out[i * 4 + 3] = (this._state[i] >>>  0) & 0xff;
        }

        return this;
    }

    // Returns the final hash digest.
    digest() {
        const out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    }

    // Internal function for use in HMAC for optimization.
    _saveState(out) {
        for (let i = 0; i < this._state.length; i++) {
            out[i] = this._state[i];
        }
    }

    _hashBlocks(w, v, p, pos, len) {
        let a, b, c, d, e,
            f, g, h, u, i,
            j, t1, t2;
        while (len >= 64) {
            a = v[0];
            b = v[1];
            c = v[2];
            d = v[3];
            e = v[4];
            f = v[5];
            g = v[6];
            h = v[7];

            for (i = 0; i < 16; i++) {
                j = pos + i * 4;
                w[i] = (((p[j] & 0xff) << 24) | ((p[j + 1] & 0xff) << 16) |
                    ((p[j + 2] & 0xff) <<  8) | (p[j + 3] & 0xff));
            }

            for (i = 16; i < 64; i++) {
                u = w[i - 2];
                t1 = (u >>> 17 | u << (32 - 17)) ^ (u >>> 19 | u << (32 - 19)) ^ (u >>> 10);

                u = w[i - 15];
                t2 = (u >>> 7 | u << (32 - 7)) ^ (u >>> 18 | u << (32 - 18)) ^ (u >>> 3);

                w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
            }

            for (i = 0; i < 64; i++) {
                t1 = (((((e >>> 6 | e << (32 - 6)) ^ (e >>> 11 | e << (32 - 11)) ^
                        (e >>> 25 | e << (32 - 25))) + ((e & f) ^ (~e & g))) | 0) +
                    ((h + ((this._K[i] + w[i]) | 0)) | 0)) | 0;

                t2 = (((a >>> 2 | a << (32 - 2)) ^ (a >>> 13 | a << (32 - 13)) ^
                    (a >>> 22 | a << (32 - 22))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            v[0] += a;
            v[1] += b;
            v[2] += c;
            v[3] += d;
            v[4] += e;
            v[5] += f;
            v[6] += g;
            v[7] += h;

            pos += 64;
            len -= 64;
        }
        return pos;
    }
}

if (typeof window !== "undefined") {
    window.CloudClient = CloudClient;
}
