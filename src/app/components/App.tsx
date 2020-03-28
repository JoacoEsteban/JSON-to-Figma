import React, {useState} from 'react';
import '../styles/ui.scss';

import {showMsg, execGetClipboard} from '../utils';
import ViewProvider from './views/ViewContext';
import LanchView from './views/LaunchView';
import OperationsView from './views/OperationsView';

const App = ({}) => {
    const [JSONobject, setJSONobject] = useState(null);

    // Helper function
    const showErrorMsg = (error, errorText) => {
        console.error(error);
        showMsg('error', errorText);
        setJSONobject(null);
    };

    // Show operation view on load
    const loadOperationView = result => {
        setJSONobject(result);
    };

    // Handle file input type
    const handleChangeButton = e => {
        let fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0]);

        fileReader.onload = () => {
            try {
                loadOperationView(JSON.parse(fileReader.result as string));
            } catch (error) {
                showErrorMsg(error, 'Something wrong with the file. Check the structure');
            }
        };
        e.target.value = null;
    };

    // Handle copy from Clipboard
    const handleClickButton = () => {
        let clipboardLink = execGetClipboard();

        fetch(clipboardLink)
            .then(response => response.json())
            .then(responseJson => {
                loadOperationView(responseJson);
            })
            .catch(error => {
                showErrorMsg(error, 'Something wrong with the URL or JSON file');
            });
    };

    const onResetClickHandle = () => {
        setJSONobject(null);
        const frameHeight = 246;
        parent.postMessage({pluginMessage: {type: 'change-size', frameHeight}}, '*');
    };

    return (
        <ViewProvider.Provider value={JSONobject}>
            {JSONobject !== null ? (
                <OperationsView onResetClick={onResetClickHandle} />
            ) : (
                <LanchView urlOnClick={handleClickButton} fileOnChange={handleChangeButton} />
            )}
        </ViewProvider.Provider>
    );
};

export default App;
