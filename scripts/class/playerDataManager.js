import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

const defaultPlayerData = {
    name: "",
    joinDate: null,
    lastSeen: null,
    playTime: null,
    dailyRewardCount: 0,
    money: 0,
    level: 1,
    exp: 0,
    statPoint: 1,
    strength: 0,
    precision: 0,
    knowledge: 0,
    defense: 0,
    magic: 0,
    agility: 0
};

export class PlayerDataManager {
    static getPlayerData(playerId) {
        const playerData = world.getDynamicProperty(playerId);
        return playerData ? JSON.parse(playerData) : null;
    }

    static modifyPlayerData(playerId, key, value) {
        let playerData = this.getPlayerData(playerId);
        if (!key in playerData) return;
        playerData[key] = value;
        world.setDynamicProperty(playerId, JSON.stringify(playerData));
    }

    static managePlayer(player) { // 100% 완성
        const form = new ActionFormData()
        .title("플레이어 데이터")
        .body("플레이어 데이터 관리 메뉴")
        .button("전체 데이터 조회")
        .button("데이터 갱신")
        .button("고급 관리");

        form.show(player).then(response => {
            if (response.selection == 0) this.lookupPlayerData(player, 0);
            else if (response.selection == 1) this.updateData(player);
            else if (response.selection == 2) this.advancedManagePlayer(player);
            else return;
        });
    }

    static lookupPlayerData(player, n) { // 100% 완성
        const playerListString = world.getDynamicProperty("playerList") || "";
        const playerList = playerListString ? playerListString.split(",") : [];
        const playerId = playerList[n];
        if (!playerId) {
            player.sendMessage("조회할 수 있는 플레이어가 없습니다.");
            return;
        }
        const playerData = this.getPlayerData(playerId);
        if (!playerData) {
            player.sendMessage("조회할 수 있는 플레이어가 없습니다.");
            return;
        }
        const form = new ActionFormData()
        .title("플레이어 데이터")
        .body(`전체 데이터 조회\n
            ${n+1}번째 플레이어 데이터
            이름 : ${playerData.name}
            [ 최초 접속일 ]
            ${playerData.joinDate}
            [ 마지막 종료시간 ]
            ${playerData.lastSeen}
            [ 총 플레이시간 ]
            ${Math.floor(playerData.playTime/3600)}시간 ${Math.floor((playerData.playTime%3600)/60)}분 ${playerData.playTime%60}초
            [ 출석 보상 수령 횟수 ]
            ${playerData.dailyRewardCount}번
            [ 보유 금액 ]
            ${playerData.money}원
            [ 레벨 ] ${playerData.level} LV
            [ 경험치 ] ${playerData.exp} EXP
            [ 잔여 스탯 ] ${playerData.statPoint} pt
            [ 투자한 스탯 ]
            힘: ${playerData.strength} 정밀: ${playerData.precision} 
            지식: ${playerData.knowledge} 내구: ${playerData.defense} 
            마력: ${playerData.magic} 민첩: ${playerData.agility}`)
        .button("이 플레이어 데이터 수정")
        .button("이 플레이어 데이터 삭제")
        .button("다음 플레이어 조회")
        .button("이전 플레이어 조회")
        .button("뒤로가기");

        form.show(player).then(response => {
            if (response.selection == 0) this.settingPlayerData(player, playerId);
            else if (response.selection == 1) this.deletePlayerData(player, playerId, n);
            else if (response.selection == 2) {
                if (n >= playerList.length - 1) this.lookupPlayerData(player, 0);
                else this.lookupPlayerData(player, n + 1);
            }
            else if (response.selection == 3) {
                if (n < 1) this.lookupPlayerData(player, playerList.length - 1);
                else this.lookupPlayerData(player, n - 1);
            }
            else if (response.selection == 4) this.managePlayer(player);
            else return;
        });
    }

    static settingPlayerData(player, playerId) { // 90% 완료, 입력값 거르는 장치는 있어야하고 테스트 필요함
        let playerData = this.getPlayerData(playerId);
        const playerDataArray = Object.entries(playerData).map(([key, value]) => `${key} : ${value}`);
        const form = new ModalFormData()
        .title("플레이어 데이터")
        .label("해당 플레이어의 데이터를 수정합니다.")
        .dropdown("수정할 데이터를 선택하세요.", playerDataArray)
        .textField("수정할 수치를 입력하세요.", "number | string");

        form.show(player).then(response => {
            if (!response || response.canceled) return;
            const playerDataKeyArray = Object.keys(playerData);
            const targetKey = playerDataKeyArray[response.formValues[1]];
            playerData[targetKey] = response.formValues[2];
            world.setDynamicProperty(playerId, JSON.stringify(playerData));
            player.sendMessage("플레이어의 데이터를 수정했습니다.");
        });
    }

    static deletePlayerData(player, playerId, n) { // 100% 완성
        const form = new ModalFormData()
        .title("플레이어 데이터")
        .label("해당 플레이어의 데이터를 전부 삭제합니다.\n삭제하고 나면 되돌릴 수 없습니다.")
        .textField("삭제하려면 텍스트필드에 delete를 입력하세요.", "delete");

        form.show(player).then(response => {
            if (!response || response.canceled) return;
            else if (response.formValues[1] === "delete") {
                const playerListString = world.getDynamicProperty("playerList") || "";
                let playerList = playerListString ? playerListString.split(",") : [];
                playerList.splice(n, 1);
                world.setDynamicProperty("playerList", playerList.join(","));
                world.setDynamicProperty(playerId, null);
                player.sendMessage("플레이어의 데이터를 삭제했습니다.");
            }
            else return;
        });
    }

    static updateData(player) { // 100% 완성
        const playerListString = world.getDynamicProperty("playerList") || "";
        const playerList = playerListString ? playerListString.split(",") : [];
        let updateCount = 0;
        playerList.forEach(playerId => {
            let playerData = this.getPlayerData(playerId);
            for (const key in defaultPlayerData) {
                if (!(key in playerData)) {
                    playerData[key] = defaultPlayerData[key]
                    updateCount++;
                }
            }
            for (const key in playerData) {
                if (!(key in defaultPlayerData)) {
                    delete playerData[key];
                    updateCount++;
                }
            }
            world.setDynamicProperty(playerId, JSON.stringify(playerData));
        });
        if (updateCount) player.sendMessage(`플레이어 데이터 형식 ${updateCount}건 최신화 완료`);
        else player.sendMessage("플레이어 데이터 형식이 이미 최신 버전입니다");
    }

    static advancedManagePlayer(player) { // 고급 관리(플레이어 추가, 모든 데이터 초기화, 다른 맵 데이터 포팅, 반출)
        const form = new ActionFormData()
        .title("플레이어 데이터")
        .body("플레이어 데이터 고급 관리 메뉴")
        .button("플레이어 데이터 불러오기")
        .button("플레이어 데이터 내보내기")
        .button("플레이어 간 데이터 이전")
        .button("플레이어 데이터 전체 삭제");

        form.show(player).then(response => {
            if (response.selection == 0) this.importPlayerData(player);
            else if (response.selection == 1) this.exportPlayerData(player);
            else if (response.selection == 2) this.migrationPlayerData(player);
            else if (response.selection == 2) this.resetPlayerData(player);
            else return;
        });
    }

    static importPlayerData(player) {

    }

    static registerPlayerData(player) { // 100% 완성
        const playerId = player.id;
        const playerData = {
            ...defaultPlayerData,
            name: player.name,
            joinDate: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toLocaleString("ko-KR")
        };
        world.setDynamicProperty(playerId, JSON.stringify(playerData));
    }
}
