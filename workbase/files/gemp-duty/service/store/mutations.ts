export default {
      /**
     * 设置meterialId
     * @param state 
     * @param payload 
     */
    setSystemOffice(state, payload) {
        state.SYSTEMOFFICE = payload;
        return state;
      },
      /**
       * 设置meterialId
       * @param state 
       * @param payload 
       */
      setMaterialId(state, payload) {
        state.METERIALID = payload;
        return state;
      },
  
      /**
       * 设置转办按钮权限
       * @param state 
       * @param payload 
       */
      setHandleState(state, payload) {
        state.HANDLE_STATE = payload;
        return state;
      },
      /**
       * 设置排班管理选中机构Id
       * @param state 
       * @param payload 
       */
      setWatchCodeWork(state, payload) {
        state.INTALLCODEWORK = payload;
        return state;
      },
  
}