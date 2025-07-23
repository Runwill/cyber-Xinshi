// drag-handler.js - 拖拽处理管理器

// 初始化拖拽处理
function initDragHandlers() {
    // 标记拖动事件初始化
    const markers = [
        { id: 'deathMarker', type: 'death' },
        { id: 'outMarker', type: 'out' },
        { id: 'flipMarker', type: 'flip' },
        { id: 'surrenderMarker', type: 'surrender' },
        { id: 'suicideMarker', type: 'suicide' }
    ];
    
    markers.forEach(marker => {
        document.getElementById(marker.id).addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', marker.type);
        });
    });

    // 全局dragover
    document.body.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    // 全局拖放处理
    document.body.addEventListener('drop', function(e) {
        const isSeat = e.target.closest && e.target.closest('.seat');
        const voterIdx = parseInt(e.dataTransfer.getData('vote-card'), 10);

        // 拖动座位死亡标记到空白处，取消该座位死亡
        const seatDeathIdx = e.dataTransfer.getData('seat-death');
        if (!isSeat && seatDeathIdx !== "") {
            markDead(Number(seatDeathIdx), false);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位票出标记到空白处，取消该座位票出
        const seatOutIdx = e.dataTransfer.getData('seat-out');
        if (!isSeat && seatOutIdx !== "") {
            markOut(Number(seatOutIdx), false);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位自爆标记到空白处，取消该座位自爆
        const seatSuicideIdx = e.dataTransfer.getData('seat-suicide');
        if (!isSeat && seatSuicideIdx !== "") {
            markSuicide(Number(seatSuicideIdx), false);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位翻牌标记到空白处，取消该座位翻牌
        const seatFlipIdx = e.dataTransfer.getData('seat-flip');
        if (!isSeat && seatFlipIdx !== "") {
            markFlipped(Number(seatFlipIdx), false);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位叛变标记到空白处，取消该座位叛变
        const seatSurrenderIdx = e.dataTransfer.getData('seat-surrender');
        if (!isSeat && seatSurrenderIdx !== "") {
            markSurrendered(Number(seatSurrenderIdx), false);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }

        // 拖动座位死亡标记到其他座位，转移
        if (isSeat && seatDeathIdx !== "" && Number(seatDeathIdx) !== Number(isSeat.getAttribute('data-index'))) {
            markDead(Number(seatDeathIdx), false);
            markDead(Number(isSeat.getAttribute('data-index')), true);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位票出标记到其他座位，转移
        if (isSeat && seatOutIdx !== "" && Number(seatOutIdx) !== Number(isSeat.getAttribute('data-index'))) {
            markOut(Number(seatOutIdx), false);
            markOut(Number(isSeat.getAttribute('data-index')), true);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位自爆标记到其他座位，转移
        if (isSeat && seatSuicideIdx !== "" && Number(seatSuicideIdx) !== Number(isSeat.getAttribute('data-index'))) {
            markSuicide(Number(seatSuicideIdx), false);
            markSuicide(Number(isSeat.getAttribute('data-index')), true);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位翻牌标记到其他座位，转移
        if (isSeat && seatFlipIdx !== "" && Number(seatFlipIdx) !== Number(isSeat.getAttribute('data-index'))) {
            markFlipped(Number(seatFlipIdx), false);
            markFlipped(Number(isSeat.getAttribute('data-index')), true);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }
        // 拖动座位叛变标记到其他座位，转移
        if (isSeat && seatSurrenderIdx !== "" && Number(seatSurrenderIdx) !== Number(isSeat.getAttribute('data-index'))) {
            markSurrendered(Number(seatSurrenderIdx), false);
            markSurrendered(Number(isSeat.getAttribute('data-index')), true);
            saveState();
            renderSeats();
            renderVoteArea();
            return;
        }

        // 投票牌拖放逻辑
        if (!isSeat && !isNaN(voterIdx)) {
            for (let i = 0; i < voteMap.length; i++) {
                voteMap[i] = voteMap[i].filter(idx => idx !== voterIdx);
            }
            saveState();
            renderSeats();
            renderVoteArea();
        }
    });
}
