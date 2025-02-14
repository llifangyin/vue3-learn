export function getSequence(arr) {
    const  result = [0];// 存放的是arr的索引 默认第一个元素
    let start ;// 二分查找的起始索引
    let end ;// 二分查找的结束索引
    let middle;// 二分查找的中间索引

    const parentNodeIndex = result.slice(0);// 拷贝一个arr的副本 用于存放索引
    const len = arr.length;
    for(let i = 0; i < len; i++) {
        const arrI = arr[i];
        if(arrI!=0){
            //为了vue项目的需求，将0的值过滤掉
            // 拿出结果集的最后一项 和  当前的这一项对比
            const resultLastIndex = result[ result.length - 1];
            // console.log(resultLastIndex,arr[resultLastIndex],arrI,'resultLastIndex');
            if(arr[resultLastIndex]< arrI){
                // 当前这一项比结果集的最后一项大
                result.push(i);
                // 正常放入的时候，前一个节点的索引就是result中的最后一个
                parentNodeIndex[i] = resultLastIndex; 
                continue
            }
        }
        start = 0;//起始位置
        end = result.length - 1;//结束位置
        while(start < end) {
            // middle =  Math.floor((start + end) / 2);//中间位置
            middle = ((start + end) / 2) | 0;//中间位置
            if(arr[result[middle]] < arrI) {
                // 中间索引的值，与当前值比较，
                // 如果小于当前值，说明当前值比中间值大，所以要在中间值的右边找
                start = middle + 1;
            }else{
                // 如果大于当前值，说明当前值比中间值小，所以要在中间值的左边找
                end = middle;
            }

        }
        // console.log(start,end,'start,end');
        if(arrI < arr[result[start]]) {
            // 如果当前值比结果集的这个位置的值小，那么就替换这个位置的值
            result[start] = i;
            parentNodeIndex[i] = result[start - 1];
        }


    }

    // 创建前驱节点，进行倒序追溯（最后一项 往前找
     let l = result.length;
     let last = result[l - 1]; //最后一项
     while(l-- >0) {
         result[l] = last;
         last = parentNodeIndex[last];
     }
    // console.log(parentNodeIndex,'parentNodeIndex');
    // let relArr = result.map((item)=>{
    //     return arr[item]
    // })
    // return relArr
    return result
};