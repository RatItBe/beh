/* 도마 손질 가능한 재료 리스트
* input: 투입할 재료
* number: 재료의 고유 번호(1~99), 같은 category의 재료 내에선 같은 번호를 가져선 안됨
* output: 손질 완료 시 생성될 재료
* category: 재료의 종류, 이 값을 읽고 해당되는 도마로 변환시키기 때문에 반드시 도마 파일의
* 식별자와 일치해야 함(예를 들어 cutting_board_chicken으로 변환시킨다면 chicken으로 작성)
*/
export const ingredientList = [
    // meat
    { input: "minecraft:porkchop", number: 1, output: "fs:cut_pork", category: "meat" },
    { input: "minecraft:mutton", number: 2, output: "fs:cut_mutton", category: "meat" },
    { input: "minecraft:beef", number: 3, output: "fs:cut_mutton", category: "meat" },

    // chicken
    { input: "minecraft:chicken", number: 1, output: "fs:cut_chicken", category: "chicken" },

    // salmon
    { input: "minecraft:salmon", number: 1, output: "fs:cut_salmon", category: "salmon" },

    // cod
    { input: "minecraft:cod", number: 1, output: "fs:cut_cod", category: "cod" }
];