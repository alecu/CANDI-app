import { assetAdded, assetDeleted, assetUpdated } from './entities/assets';
import { characterAdded, characterDeleted, characterUpdated } from './entities/characters';
import { gamestateReceived } from './entities/gamestate';
import { playerActionUpdated, actionAdded, actionDeleted } from './entities/playerActions';
import socket from '../socket'
import store from './store';

const initUpdates = () => {
    socket.on('updateClients', (data) => { 
        console.log('updateClients');
        for (const el of data) {
            switch(el.model) {
                case 'Character':
                    store.dispatch(characterUpdated(el));
                    break;
                case 'Action':
                    store.dispatch(playerActionUpdated(el));
                    break;
                case 'Gamestate':
                    store.dispatch(gamestateReceived(el));
                    break;
                case 'Asset':
                    store.dispatch(assetUpdated(el));
                    break;
                default:
                    console.log(`Unable to update Redux for ${el.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('createClients', (data) => { 
        console.log('createClients');
        for (const el of data) {
            switch(el.model) {
                case 'Character':
                    store.dispatch(characterAdded(el));
                    break;
                case 'Action':
                    store.dispatch(actionAdded(el));
                    break;
                case 'Gamestate':
                    console.log('DEAR GOD IF YOU SEE THIS FUCKING CALL SCOTT OH GOD HOW COULD THIS HAPPEN')
                    break;
                case 'Asset':
                    store.dispatch(assetAdded(el));
                    break;
                default:
                    console.log(`Unable to add Redux for ${el.model}: ${el._id}`);
                    break;
            }
        }
    });

    socket.on('deleteClients', (data) => { 
        console.log('deleteClients');
        for (const el of data) {
            switch(el.type) {
                case 'character':
                    store.dispatch(characterDeleted(el));
                    break;
                case 'action':
                    store.dispatch(actionDeleted(el));
                    break;
                case 'Gamestate':
                    console.log('DEAR GOD IF YOU SEE THIS FUCKING CALL SCOTT OH GOD HOW COULD THIS HAPPEN')
                    break;
                case 'asset':
                    store.dispatch(assetDeleted(el));
                    break;
                default:
                    console.log(`Unable to add Redux for ${el.type}: ${el.id}`);
                    break;
            }
        }
    });

/*	socket.on('updateCharacters', (data) => { store.dispatch(charactersReceived(data)) });
	socket.on('updateCharacter', (data) => { store.dispatch(characterUpdated(data)) });


    socket.on('updateActions', (data) => { store.dispatch(playerActionsReceived(data)) });
    socket.on('updateAction', (data) => { store.dispatch(playerActionUpdated(data)) });
    socket.on('actionCreated', (data) => { store.dispatch(actionAdded(data)) });
    socket.on('actionDeleted', (data) => { store.dispatch(actionDeleted(data)) });
    
    socket.on('updateGamestate', (data) => { store.dispatch(gamestateReceived(data)) });
    socket.on('updateAssets', (data) => { store.dispatch(assetsReceived(data)) });
    */
}



export default initUpdates;