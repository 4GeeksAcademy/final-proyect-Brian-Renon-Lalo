export const initialStore=()=>{
  return{
    message: null,
    isLogged: false
   }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    case 'set_Logged':
      return{
        ...store,
        isLogged: action.payload
      }  
      
    

    default:
      throw Error('Unknown action.');
  }    
}
