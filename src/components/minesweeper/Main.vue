<template>
    <div class="minesweeper_main">
        <div class="title">
            <h1>지뢰찾기</h1>
            <input type="text" v-model="initData.row">ⅹ<input type="text" v-model="initData.row"> 게임 
            / 
            지뢰의 개수 <input type="text" v-model="initData.mineCount">개
            <br>
            <button @click="init()"  v-if="!start">지뢰 찾기 시작</button>
            <button @click="giveup()" v-else>게임 종료</button>
        </div>
        <hr>
        <table>
            <tr v-for="(row, xpos) in matrix" :key="xpos">
                <td class="cell" v-for="(c, ypos) in row" :key="ypos" @click="onClickCell(c)">
                    <span v-if="c.isCheck">
                        {{c.value}}
                    </span>
                </td>
            </tr>
        </table>
        </div>        
</template>

<script>
    export default {
        data() {
            return {
                initData : {
                    row : 10,
                    mineCount : 10
                },
                matrix : null,
                start : false,
                checkCellCount : null,
            };
        },
        methods: {
            checkInvalidData(){
                var data = this.initData
                if(data.row < 1 || data.mineCount < 1){
                    this.$toasted.error('줄 혹은 지뢰의 개수는 0이하일 수 없습니다.');
                    return false
                }
                if(data.row * data.row <= data.mineCount){
                    this.$toasted.error('지뢰의 개수는 '+data.row * data.row+'개 보다 같거나 클 수 없습니다.');
                    return false
                }
                return true
            },
            init(){
                if(!this.checkInvalidData()) return
                this.axios
                .get('/mine/init', {
                    params : this.initData
                })
                .then(res=>{
                    if(res.data.success){
                        this.start = true
                        this.matrix = res.data.matrix
                        this.$toasted.show('게임 시작!');
                    }
                })
                .catch(err=>{
                    this.$toasted.show('서버에러 개발자에 문의하세요!');
                })
            },
            reset(){
                this.start = false
                this.initData.row = 10,
                this.initData.mineCount = 10
                this.matrix = null
            },
            giveup(){
                this.reset()
                this.$toasted.error('게임 종료 ㅠㅠ');
            },
            onClickCell(cell){
                if(cell.value === 'MINE'){
                    this.reset()
                    return this.$toasted.error('지뢰를 밟으셨어요! 실패');
                }
                this.checkCellCount++
                cell.isCheck = true
                if(this.isSuccess()){
                    this.reset()
                    return this.$toasted.success('성공!');
                }
            },
            isSuccess(){
                var notMineCellCount = this.initData.row * this.initData.row - this.initData.mineCount
                if(notMineCellCount == this.checkCellCount) return true
                return false
            }
        }
    };
</script>

<style lang="scss">
    $socar-color: #00d2ff;
    .minesweeper_main {
        .title{
            &, * {
                text-align: center;
                font-weight: bold;
                margin: 5px 0px;
            }
            input {
                width: 25px;
            }
        } 
        table {
            margin: auto;
            background: #fff;
            border-collapse: collapse;
            .cell{
                border: 2px black solid;
                padding: 5px;
                width: 30px;
                height: 30px;
                text-align: center;
                font-weight: bold;
                font-size: 18px;
                cursor: pointer;
                &:hover {
                    background: $socar-color;
                }
                &:active {
                    background: #508590;
                }
            }
        }
    }
</style>