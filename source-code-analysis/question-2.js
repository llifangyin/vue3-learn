// 最长递增子序列
// a b  c d e q    f g 
// a b  e c d h    f g
// c d e  在旧序列索引 2 3 4
//   c d e 在新序列索引 4 2 3 0   0 表示以前不存在
// c d e  =>  e c d h  通过两个序列求出某些元素不用动 [0,1]


//2 3 7 6 8 4 9 11 4 5 6 7 9 12 求最长递增子序列(可以不连续)

/**
 * Finds the length of the longest increasing subsequence in an array.
 *
 * @param {number[]} arr - The input array of numbers.
 * @returns {number} The length of the longest increasing subsequence.
 */
// 动态规划实现
function lengthOfLIS(nums) {
    // 该方法的时间复杂度为 O(n^2)
    //首先检查输入数组 nums 是否为空，如果为空则返回 0。
// 创建一个数组 dp，长度与 nums 相同，并初始化为 1。dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度。
// 使用双重循环遍历数组 nums。外层循环变量 i 从 0 到 nums.length - 1，内层循环变量 j 从 0 到 i - 1。
// 在内层循环中，如果 nums[j] 小于 nums[i]，则更新 dp[i] 的值为 dp[j] + 1 和 dp[i] 中的较大值。
// 最后，返回 dp 数组中的最大值，即为最长递增子序列的长度。
// 通过这种方式，dp 数组记录了每个位置的最长递增子序列长度，最终结果为 dp 数组中的最大值



    if(nums.length === 0) return 0;
    // dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
    const dp = new Array(nums.length).fill(1); // 初始化每个数字至少构成一个子序列
    // nums [10,9,2,5,3,18]
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                // 更新以 nums[i] 结尾的子序列长度
                dp[i] = Math.max(dp[i], dp[j] + 1);
                console.log(i,j,nums[i],nums[j],dp[i],dp[j],'i,j,nums[i],nums[j],dp[i],dp[j]');
                console.log(dp,'dp');
            }
        }
    }
    // 最大的 dp 值就是最长递增子序列
    return Math.max(...dp);
};

// 测试数组
let arr = [10,9,2,5,3,18]
// 调用函数并输出结果
let result = lengthOfLIS(arr);
console.log(result,'result'); // 输出最长递增子序列的长度
