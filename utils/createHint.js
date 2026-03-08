export function createKeyHint(key){

    let hint = key;

    if(key.length > 4){
        hint = key.slice(-4);
    }

    return hint;
}
