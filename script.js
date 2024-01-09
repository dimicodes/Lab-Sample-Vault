// check if the samples array already exists in local storage, if not, default to empty array
const samplesLocalStorageKey = "samplesLocalStorage";
let samples = JSON.parse(localStorage.getItem(samplesLocalStorageKey)) || [];

let currentBatch = null;

function submitSample() {
    let batch = document.getElementById('batchNumber').value;

    var sample = {
        name: document.getElementById('sampleName').value,
        location: document.getElementById('sampleLocation').value,
        protocol: document.getElementById('sampleProtocol').value,
        status: document.getElementById('sampleStatus').value,
        batch: batch,
        ID: assignID(batch)
    };

    pushData(sample);
    console.log('Current Samples:', samples);
    // save to local storage
    localStorage.setItem(samplesLocalStorageKey, JSON.stringify(samples));
    document.getElementById('sampleForm').reset();
}

// updates a the status of an entire batch
function updateBatch() {
    let updateBatchNumber = document.getElementById('updateBatchNumber').value;
    let updateStatus = document.getElementById('updateBatchStatus').value;

    for (let sample of samples) {
        if (sample.batch == updateBatchNumber) {
            sample.status = updateStatus;
        }
    }
    console.log('Current Samples:', samples);
    localStorage.setItem(samplesLocalStorageKey, JSON.stringify(samples));
}

// updates a sample's status by sample ID
function updateSample() {
    let sampleID = document.getElementById('sampleID').value;
    let updateStatus = document.getElementById('updateStatusByID').value;

    for (let sample of samples) {
        if (sample.ID == sampleID) {
            sample.status = updateStatus;
        }
    }
    console.log('Current Samples:', samples);
    localStorage.setItem(samplesLocalStorageKey, JSON.stringify(samples));
}

// searches a sample by batch (all samples in the batch) or by specific ID
function searchSampleByID() {
    let sampleID = document.getElementById('searchID').value;

    for (let sample of samples) {
        if (sample.ID == sampleID) {
            console.log(sample);
        } 
    } 
}

function searchSampleByBatch() {
    let searchBatch = document.getElementById('searchBatch').value;
    for (let sample of samples) {
        if (sample.batch == searchBatch) {
            console.log(sample);
        } 
    } 
}

function pushData(sample) {
    samples.push(sample);
}

// assigns unique ID to a sample entered in the form
function assignID(batch) {
    let highestIDOverall = 0;

    // find the highest ID in all samples, not just in the current batch
    for (let sample of samples) {
        if (sample.ID > highestIDOverall) {
            highestIDOverall = sample.ID;
        }
    }

    let isNewBatch = true;

    // check if the current batch already exists
    for (let sample of samples) {
        if (sample.batch === batch) {
            isNewBatch = false;
            break; // no need to continue checking if we find a match
        }
    }

    if (isNewBatch) {
        // ff it's a new batch, start with the next multiple of 10 after the highest ID overall
        return Math.ceil((highestIDOverall + 1) / 10) * 10;
    } else {
        // if it's not a new batch, increment the highest ID found in the batch
        return highestIDOverall + 1;
    }
}





// this function can be used for a later version of this program that allows for multi-sample input
function getStartingSampleID(AllSampleIDs, NumSamplesInBatch) {
    let highestIDOverall = AllSampleIDs.length > 0 ? Math.max(...AllSampleIDs) : 0;
    let startID = Math.ceil((highestIDOverall + 1) / 10) * 10;

    while (true) {
        let isRangeAvailable = true;

        // check for availability of the range from startID to startID + NumSamplesInBatch - 1
        for (let i = 0; i < NumSamplesInBatch; i++) {
            // iterates to see if AllSampleIDs includes a number in the range
            if (AllSampleIDs.includes(startID + i)) {
                isRangeAvailable = false;
                break;
            }
        }

        // if startID to NumSamplesInBatch is clear, the startID is good
        if (isRangeAvailable) {
            return startID; // return the starting ID if the range is available
        } else {
            startID += 10; // move to the next multiple of 10 and recheck
        }
    }
}
