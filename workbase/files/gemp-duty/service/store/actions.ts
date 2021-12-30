export default {
    /**
        * 设置系统设置的office使用方法
        * @param context 
        * @param payload 
        */
    setSystemOffice(context, payload) {
        context.commit('setSystemOffice', payload)
    },
    /**
     * 设置编辑,保存的meterialId
     * @param context 
     * @param payload 
     */
    setMaterialId(context, payload) {
        context.commit('setMaterialId', payload)
    },

    /**
     * 设置转办按钮显示状态
     * @param context 
     * @param payload 
     */
    setHandleState(context, payload) {
        context.commit('setHandleState', payload)
    },
    /**
     * 设置排班管理选中机构Id
     * @param context 
     * @param payload 
     */
    setWatchCodeWork(context, payload) {
        context.commit('setWatchCodeWork', payload)
    }

}