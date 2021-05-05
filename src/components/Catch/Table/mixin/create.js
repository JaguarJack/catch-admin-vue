export default {
  methods: {
     handleCreate(row) {
       /** if (this.getParent.beforeCreate !== undefined) {
         const p = this.getParent.beforeCreate(row)

         if (p instanceof Promise) {
           p.then(() => {
            this.handleShowDialog(row)
           })

           return false
         }
       }*/

       this.handleShowDialog()
     }
  }
}
