<template>
    <div class="statusBarBody">
        <div class="barImages"><img :src="barImg"></div>
        <div class="barText">{{barName}}{{point}}</div>
    </div>
</template>

<script>
    export default {
        name: "statusBar",
        props: {
            barName: {
                type :String
            },
            barImg: {
                type: undefined
            },
            point: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
            }
        }
    }
</script>

<style scoped lang="scss">
   .statusBarBody{
       padding: 20px 130px;
       box-sizing: border-box;
       background: rgba(29,45,85,0.5);
       .barImages{
           width: 30px;
           height: 30px;
           display: inline-block;
           vertical-align: middle;
           img{
               width: 100%;
               height: 100%;
               display: block;
           }
       }
       .barText {
           margin-left: 15px;
           font-size: 20px;
           color: #fff;
           display: inline-block;
           vertical-align: middle;
       }
   }
</style>