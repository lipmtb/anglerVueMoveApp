import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store=new Vuex.Store({
    state:{
        anglerId:'',
        anglerName:''
    },
    mutations:{
        changeUserState(state,payload){
            state.anglerName=payload.anglerName;
            state.anglerId=payload.anglerId;
        }
    }
})

export default store;