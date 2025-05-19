import { BlockPermutation, system } from "@minecraft/server";

export class structureSystem {
    static saveStructure(player, block) {
        let x1 = player.getDynamicProperty("x");
        let y1 = player.getDynamicProperty("y");
        let z1 = player.getDynamicProperty("z");
        
        if (x1 === undefined || y1 === undefined || z1 === undefined) { // 첫번째 좌표 설정
            x1 = block.location.x;
            y1 = block.location.y;
            z1 = block.location.z;
            player.setDynamicProperty("x", x1);
            player.setDynamicProperty("y", y1);
            player.setDynamicProperty("z", z1);
            player.sendMessage(`첫 번째 좌표 저장: (${x1}, ${y1}, ${z1})`);
            return;
        }

        // 두 번째 좌표 설정
        let x2 = block.location.x;
        let y2 = block.location.y;
        let z2 = block.location.z;
        player.sendMessage(`두 번째 좌표 저장: (${x2}, ${y2}, ${z2})`);
        
        let structure = [];
        let totalBlocks = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1) * (Math.abs(z2 - z1) + 1);
        let processedBlocks = 0;
        let blockPositions = [];

        // 블록 좌표 배열 생성
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
                    blockPositions.push({ x, y, z });
                }
            }
        }

        function saveBlocks() {
            let batchSize = 100; // 한 번에 처리할 블록 수
            for (let i = 0; i < batchSize && blockPositions.length > 0; i++) {
                const pos = blockPositions.shift();
                const block = player.dimension.getBlock(pos);
                const blockData = {
                    typeId: block.typeId,
                    states: block.permutation.getAllStates(),
                    location: pos
                };
                structure.push(blockData);
                processedBlocks++;
            }

            // 진행 상태 출력
            player.sendMessage(`블록 저장 중: ${processedBlocks}/${totalBlocks} 완료`);

            // 모든 블록이 저장되었을 때
            if (blockPositions.length === 0) {
                const blockString = JSON.stringify(structure);
                player.sendMessage("구조물 저장 완료! 데이터 정리 중...");
                
                // 문자열을 1000자씩 나누어서 출력
                let chunkSize = 1000;
                let currentIndex = 0;

                function printChunks() {
                    if (currentIndex < blockString.length) {
                        let endIndex = Math.min(currentIndex + chunkSize, blockString.length);
                        let chunk = blockString.slice(currentIndex, endIndex);
                        console.warn(chunk);  // 부분 문자열 출력
                        currentIndex = endIndex;
                        player.sendMessage(`출력 중: ${Math.floor((currentIndex / blockString.length) * 100)}%%`);

                        // 일정 시간 후 다시 실행
                        system.runTimeout(printChunks, 1); // 1틱 후 재실행 (0.05초)
                    } else {
                        player.sendMessage("구조물 출력 완료!");
                        player.setDynamicProperty("x", undefined);
                        player.setDynamicProperty("y", undefined);
                        player.setDynamicProperty("z", undefined);
                    }
                }

                // 첫 출력 시작
                printChunks();
            } else {
                // 일정 시간 후 다시 실행
                system.runTimeout(saveBlocks, 1); // 1틱 후 재실행 (0.05초)
            }
        }

        // 첫 실행
        saveBlocks();
    }


    static loadstructure(player) {
        try {
            const structureString = ''
            let formattedString = structureString.replace(/[\r\n]+/g, ""); // 줄바꿈 제거
            formattedString = formattedString.replace(/\[Scripting\]\[warning\]-/g, ""); // 경고 문구 제거

            const structure = JSON.parse(formattedString);

            structure.forEach(blockData => {
                const location = blockData.location;
                const permutation = BlockPermutation.resolve(blockData.typeId);

                // 블록 상태 설정
                Object.keys(blockData.states).forEach(key => {
                    permutation.withState(key, blockData.states[key]);
                });

                // 블록 설치
                system.run(() => {
                    player.dimension.setBlockPermutation(location, permutation);
                })
            });

            player.sendMessage("구조물 복원이 완료되었습니다!");
        } catch (error) {
            player.sendMessage("복원 중 오류 발생!");
            console.warn(error);
        }
    }
}