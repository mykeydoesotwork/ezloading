export function dprt(...rest) {
    for (let i = 0; i < rest.length; i=i+2) {
        console.group(rest[i] + ":");
        console.log(rest[i+1]);
        console.groupEnd(rest[i] + ":");
    }
}

// let processImpactResult = [[{attrs: {cargoId: "cargo-4"}}, 600, 660, 'isWall'],
//                        [{attrs: {cargoId: "cargo-6"}}, 100, 120, 'isWall'],
//                        [{attrs: {cargoId: "cargo-8"}}, 150, 960, 'isNotWall'],
//                        [{attrs: {cargoId: "cargo-10"}}, 550, 880, 'isWall']]

// let resolvedArray = [[{attrs: {cargoId: "cargo-4"}}, 300, 400, 'isWall'],
//                  [{attrs: {cargoId: "cargo-6"}}, 300, 400, 'isWall'],
//                  [{attrs: {cargoId: "cargo-10"}}, 300, 400, 'isWall']]

// mergeArrays(resolvedArray, processImpactResult);
// console.log(resolvedArray.map(x=>`${x[0].attrs.cargoId},${x[1]},${x[2]},${x[3]}`))
// => ['cargo-4,600,660,isWall', 'cargo-6,100,120,isWall', 'cargo-8,150,960,isNotWall', 'cargo-10,550,880,isWall']

// destructively merges processImpactResult with resolvedArray
export function mergeArrays(resolvedArray, processImpactResult) {
    let saveIndex = 0
    for (let index = 0; index<processImpactResult.length; index++) {
        let foundIndex = resolvedArray.findIndex(x=>(x[0].attrs.cargoId === 
                                                     processImpactResult[index][0].attrs.cargoId))
        if( foundIndex >= 0) {
            resolvedArray[foundIndex] = processImpactResult[index]
            saveIndex = foundIndex;
            
        } else {
            resolvedArray.splice(saveIndex+1, 0, processImpactResult[index])
        }
        
    }
}

/* eslint-disable */ 

// call example: var intersection =
// haveIntersection([x, x.x(), x.y(),'isNotWall'], x.findOne('Rect').getClientRect(), targetRect, target.x(), target.y())
// left of target deltax is -ve, above target deltay is -ve
// collidedItem: [Group, 750, 68, 'isNotWall']
export function haveIntersection(collidedItem, collidedItemBareRect, targetRect, targetXPos, targetYPos) {
    var collidedItemX = collidedItem[1]
    var collidedItemY = collidedItem[2]
    var intersectionResult = !(targetXPos > collidedItemX + collidedItemBareRect.width || targetXPos + targetRect.width < collidedItemX || targetYPos > collidedItemY + collidedItemBareRect.height || targetYPos + targetRect.height < collidedItemY);
    //var intersectionResult = !(r2.x       > r1.x + r1.width || r2.x       + r2.width     < r1.x || r2.y       > r1.y + r1.height || r2.y       + r2.height     < r1.y);
    // to find the delta the lower point should have height or width added to it in the subtraction
    // Kept here for use in TESTING_PixelPushing for how to compute intRes.transform.y:
    // these computed values give the wrong sign for small cargo which are entirely overlapped resulting in eg. two top borders being highlighted when target is
    // in between them :
    // var deltax = collidedItemX < targetXPos ? targetXPos - (collidedItemX + collidedItemBareRect.width + 1)  : (targetXPos + targetRect.width + 1) - collidedItemX;
    // var deltay = collidedItemY < targetYPos ? targetYPos - (collidedItemY + collidedItemBareRect.height + 1) : (targetYPos + targetRect.height + 1) - collidedItemY;

    // target and collidedItem centerpoints
    var targetCenterX = targetXPos + targetRect.width/2
    var targetCenterY = targetYPos + targetRect.height/2;    
    var collidedItemCenterX = collidedItemX + collidedItemBareRect.width/2
    var collidedItemCenterY = collidedItemY + collidedItemBareRect.height/2
    var centerDeltaX = collidedItemCenterX - targetCenterX; // -ve: collided is right of target, +ve: collided is left of target
    var centerDeltaY = collidedItemCenterY - targetCenterY; // -ve: collided is below target, +ve: collided is above target

    // only transform along largest axis of centerpoint distance
    // if Math.abs(centerDeltaX) == Math.abs(centerDeltaY) then both transformx == transformy == 0 and
    // the whichever the last highlighted border was, will remain highlighted.
    var transformx = Math.abs(centerDeltaX) > Math.abs(centerDeltaY) ? centerDeltaX : 0
    var transformy = Math.abs(centerDeltaX) <= Math.abs(centerDeltaY) ? centerDeltaY : 0

    var intersectionObj = { intersectionResult: intersectionResult, transform: {x: transformx, y: transformy } };
    return intersectionObj;
}

/* eslint-enable */


//DELETE THIS IT WAS A MISTAKE USED IN OLD PROCESSIMPACT's OLD DEDUPESTACKEDCARGO
//axisOverlap is required because the axis opposite of haveIntersection transform direction is zeroed out
export function axisOverlap(collidedItem, collidedItemRect, target, targetRect) {
    // collidedItem Coordinates
    var rect1 = {left: collidedItem.x(),
                 right: collidedItem.x() + collidedItemRect.width,
                 top: collidedItem.y(),
                 bottom: collidedItem.y() + collidedItemRect.height}
    // target Coordinates
    var rect2 = {left: target.x(),
                 right: target.x() + targetRect.width,
                 top: target.y(),
                 bottom: target.y() + targetRect.height}
    
    var x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
    var y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
    return [x_overlap, y_overlap]
}




// targetXPos and targetYPos are used to evaluate collision with prospective new coordinates for cargo being bumped
// otherwise cargo will only process wall collision if the old stale coordinates of target are intersecting a wall
// processWallCollisions returns new X/Y coordinates for target, and the primary wall where most of the collision occured
// determined by the overlap area. The primary wall is used to determine the direction in which any collided cargo will move.
//nb: both target and layerChildren must have the backing rectangle removed before passed as arguments, because I did not have time to fix this
export function processWallCollisions(target, targetXPos, targetYPos, layerChildren) {
    
    // check collision
    // -1 is used here because the inner rectangle is one pixel too small likely due to strokeWidth ignored
    // haveIntersection adds 1 pixel when calculating deltax and deltay, but not during intersection checks,
    // because it checks for cargo-cargo intersection, not cargo-wall intersection.
    var haveIntersection = (collidedItem, collidedItemBareRect, targetRect, targetXPos, targetYPos) => 
                        !(targetXPos > collidedItem.x() + collidedItemBareRect.width 
                        || targetXPos + targetRect.width - 1< collidedItem.x() 
                        || targetYPos > collidedItem.y() + collidedItemBareRect.height 
                        || targetYPos + targetRect.height - 1< collidedItem.y());
    
    // konva group properties: el.attrs.cargoId, el.id(), el.y()
    // var layerChildren = this.$refs.layer.getNode().getLayer().children;
    var targetRect = target.findOne('Rect').getClientRect();
    
    var leftWall = layerChildren.find(el=>(el.attrs.truckId === 'leftWall'))
    var backWall = layerChildren.find(el=>(el.attrs.truckId === 'backWall'))
    var rightWall = layerChildren.find(el=>(el.attrs.truckId === 'rightWall'))
    
    var wall = 'isNotWall' // isWall or isNotWall
    var wallLocation = 'isNotWall' // 'isNotWall' xor 'rightWall' xor 'leftWall' xor 'backWall'
    
    // Overlap Area Processing -------------------------------------------------------
    
    // if ?Wall is undefined in the layerChildren array passed in then set it to false for further processing below
    var backWallCoords = backWall ? {
        left: backWall.x?.(),
        right: backWall.x?.() + backWall.width?.(),
        top: backWall.y?.(),
        bottom: backWall.y?.() + backWall.height?.(),
    } : false
    
    var leftWallCoords = leftWall ? {
        left: leftWall.x?.(),
        right: leftWall.x?.() + leftWall.width?.(),
        top: leftWall.y?.(),
        bottom: leftWall.y?.() + leftWall.height?.(),
    } : false
    
    var rightWallCoords = rightWall ? {
        left: rightWall.x?.(),
        right: rightWall.x?.() + rightWall.width?.(),
        top: rightWall.y?.(),
        bottom: rightWall.y?.() + rightWall.height?.(),
    } : false
    
    var targetRectCoords = { left: targetXPos,
                             right: targetXPos + targetRect.width,
                             top: targetYPos,
                             bottom: targetYPos + targetRect.height, }
    
    function overlapArea(rect1, rect2) {
        var x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        var y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        return x_overlap * y_overlap;
    }
    // if ?WallCoords eval to false from above, then 0 them out so they cannot be maximum
    var overlapAreaArray = [backWallCoords ? overlapArea(backWallCoords, targetRectCoords) : 0,
                            leftWallCoords ? overlapArea(leftWallCoords, targetRectCoords) : 0,
                            rightWallCoords ? overlapArea(rightWallCoords, targetRectCoords) : 0]
    
    if(Math.max(...overlapAreaArray) == 0) {
        wallLocation = 'isNotWall';
    } else {
        switch(overlapAreaArray.findIndex(x=>x==Math.max(...overlapAreaArray))) {
        case 0:
            wallLocation = 'backWall';
            break;
        case 1:
            wallLocation = 'leftWall';
            break;
        case 2:
            wallLocation = 'rightWall';
            break;
        default:
            wallLocation = 'isNotWall';
        }}
    
    // Collision Processing ----------------------------------------------------------------------
    
    
    
    // (collidedItem, collidedItemBareRect, targetRect, targetXPos, targetYPos)
    var intersectLeftWallCargo = leftWall ? haveIntersection(leftWall, leftWall.getClientRect(), targetRect, targetXPos, targetYPos) : false
    if (intersectLeftWallCargo) {
        targetXPos = leftWall.x?.() + leftWall.width?.() + 1;
        wall  = 'isWall';
    }
    
    // (collidedItem, collidedItemBareRect, targetRect, targetXPos, targetYPos)
    var intersectRightWallCargo = rightWall ? haveIntersection(rightWall, rightWall.getClientRect(), targetRect, targetXPos, targetYPos) : false
    if (intersectRightWallCargo) {
        targetXPos = rightWall.x?.() - targetRect.width
        wall = 'isWall';
    }
    
    // (collidedItem, collidedItemBareRect, targetRect, targetXPos, targetYPos)
    var intersectBackWallCargo = backWall ? haveIntersection(backWall, backWall.getClientRect(), targetRect, targetXPos, targetYPos) : false
    if (intersectBackWallCargo) {
        targetYPos = backWall.y?.() + backWall.height?.() + 1;
        wall  = 'isWall';
    }
    
    
    
    //return [target, targetXPos, targetYPos, wall]
    return [[target, targetXPos, targetYPos, wall], wallLocation]
    
    
}

export function processImpact_debug_backup(target, targetXPos, targetYPos, wallStatus, unresolvedArray, stackName, layerChildren) {
    // target: dragged object,
    var targetRect = target.findOne('Rect').getClientRect();
    // targetRect: target.findOne('Rect').getClientRect();
    // targetXPos: the proposed position of target
    // targetYPos: the proposed position of target
    // unresolvedArray: layerChildren removing walls and removing target
    stackName = stackName + " " + "stackname-" + Math.floor(Math.random() * 991 + 10);
    //console.log(`{${stackName} processImpact called with args: target: ${target.attrs.cargoId}, targetXPos: ${targetXPos}, targetYPos: ${targetYPos}, unresolvedArray: ${JSON.stringify(unresolvedArray.map(x=>x[0].attrs.cargoId))}`); //tmpdbg
    
    // Check if target collides with a wall
    // [return [target, targetXPos, targetYPos, wall]]
    // var wallCollision = [processWallCollisions(target, targetXPos, targetYPos)];
    var processWallCollisionsResult = processWallCollisions(target, targetXPos, targetYPos, layerChildren);
    var wallCollision = [processWallCollisionsResult[0]]; // must be wrapped in an array for concatenation 
    var wallLocation = processWallCollisionsResult[1];
    // Clobber local targetXPos and targetYPos if wall collision has occurred,
    // if no collision has occurred then use the new targetX/YPos arguments that have been passed in instead
    if (wallCollision[0][3] === 'isWall') {
        targetXPos = wallCollision[0][1];
        targetYPos = wallCollision[0][2];
        //console.log(` ${stackName} due to a wall collision targetXPos and targetYPos are being clobbered: target.attrs.cargoId: ${target.attrs.cargoId} targetXPos: ${targetXPos} targetYPos: ${targetYPos}`); //tmpdbg
    }
    
    var inheritCollision = (wallCollision[0][3] === 'isWall') || (wallStatus === 'isWall')  ? 'isWall' : 'isNotWall'
    
    //resolvedArray is the first wave of collision with target
    // each resolvedArray item has: resolvedArray[0] = collidedItem cargo konva object
    // resolvedArray[0],[1] = assign first wave collisions new X/Y coordinates
    // resolvedArray[2] = 'isWall' if target has collided with wall wallCollision[0][3]==='isWall' above,
    //                     or wallStatus arg = 'isWall' chained forward in processImpact arg due to a target 
    //                     colliding with a wall in the past of the chain
    var resolvedArray = unresolvedArray.map( function(collidedItem) {
        var collidedItemX = collidedItem[1]
        var collidedItemY = collidedItem[2]
        var bareRect = collidedItem[0].findOne('Rect').getClientRect();
        var preCollisionIntersection = haveIntersection(collidedItem, bareRect, targetRect, target.x(), target.y())                
        // var intersectionObj = { intersectionResult: intersectionResult, transform: {x: transformx, y: transformy } };
        var intersection = haveIntersection(collidedItem, bareRect, targetRect, targetXPos, targetYPos)                
        if (intersection.intersectionResult) {
            // If target has collided with wall, push collidedItem in opposite direction of wall
            // else push in direction of axis with smallest overlap
            // The purpose of preCollisionIntersection.transform.x == 0 is to prevent all objects in the 
            // unresolvedArray to be pushed downwards just because the target intersected the wallLocation = 'backWall'
            switch(true) {
            case (wallLocation === 'backWall'  && preCollisionIntersection.transform.x == 0):
                return [collidedItem[0], collidedItemX, targetYPos+targetRect.height+1, inheritCollision];                        
            case (wallLocation === 'rightWall' && preCollisionIntersection.transform.y == 0):
                return [collidedItem[0], targetXPos-bareRect.width-1, collidedItemY, inheritCollision];
            case (wallLocation === 'leftWall' && preCollisionIntersection.transform.y == 0):
                return [collidedItem[0], targetXPos+targetRect.width+1, collidedItemY, inheritCollision];                        
            default: //(wallLocation === 'isNotWall')
                if (Math.abs(intersection.transform.x) < Math.abs(intersection.transform.y)) { // in y direction
                    if(intersection.transform.y < 0) { // above
                        //collidedItem above y transform is -ve
                        return [collidedItem[0], collidedItemX, targetYPos-bareRect.height-1, inheritCollision]
                    } else { // below (0 or more)
                        //collidedItem below y transform is +ve
                        return [collidedItem[0], collidedItemX, targetYPos+targetRect.height+1, inheritCollision]
                    }
                    
                } else { // in x direction
                    if(intersection.transform.x < 0) { // to the left
                        //collidedItem left x transform is -ve
                        return [collidedItem[0], targetXPos-bareRect.width-1, collidedItemY, inheritCollision] 
                    } else { // to the right 0 or more
                        //collidedItem right x transform is +ve
                        return [collidedItem[0], targetXPos+targetRect.width+1, collidedItemY, inheritCollision] 
                    }
                }
            }
        }
    }.bind(this))

    
    // if there are no collisions if (intersection.intersectionResult) {...}
    // will return undefined in the final map result; remove this undefined:
    resolvedArray = resolvedArray.filter(function(el) {return el !== undefined});
    // console.log(` ${stackName} First collision wave completed with target: ` + JSON.stringify(target.attrs.cargoId) +
    //             " unresolvedArray: " + JSON.stringify(unresolvedArray.map(x=>x[0].attrs.cargoId)) +
    //             " resolvedArray: " + JSON.stringify(resolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]]))); //tmpdbg

    
    // accumArray is chain reaction collisions beyond the first wave
    var accumArray = []
    resolvedArray.forEach( function(item) {
        var newTarget = item[0];
        var newTargetXPos = item[1];
        var newTargetYPos = item[2];
        var newUnresolvedArray = unresolvedArray.filter(function(el) {return el[0] !== newTarget});

        // console.log(` ${stackName} START building accumArray: resolvedArray.forEach calling processImpact ` +
        //             " newTarget: " + JSON.stringify(newTarget.attrs.cargoId) +
        //             " newUnresolvedArray: " + JSON.stringify(newUnresolvedArray.map(x=>x[0].attrs.cargoId))); //tmpdbg
        
        var newResolvedArray = processImpact(newTarget, newTargetXPos, newTargetYPos, inheritCollision, newUnresolvedArray, stackName, layerChildren);
        accumArray = accumArray.concat(newResolvedArray);

        // console.log(` ${stackName} END building accumArray: resolvedArray.forEach returned from processImpact ` +
        //             " newResolvedArray: " + JSON.stringify(newResolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) +
        //             " accumArray = accumArray.concat(newResolvedArray): " + JSON.stringify(accumArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]]))); //tmpdbg

        
    }.bind(this))
    
    //reprocess accumArray values here
    
    //save all walls returned from processImpact calls
    let blowbackTargetArray = accumArray.filter(x=>x[3]==='isWall')
    
    
    // merge target back to unresolvedArray
    let checkIndex = unresolvedArray.findIndex(x=>(x[0].attrs.cargoId === target.attrs.cargoId))
    
    let blowbackUnresolvedArray = [];
    if(checkIndex >= 0) {
        blowbackUnresolvedArray = unresolvedArray.slice();
        blowbackUnresolvedArray[checkIndex] = [target, targetXPos, targetYPos, wallStatus];
    } else {
        blowbackUnresolvedArray = unresolvedArray.concat([[target, targetXPos, targetYPos, wallStatus]])
    }
    
    let blowbackResult = []
    //call processImpact on every wall blowback cargo as target, with current target added back to unresolvedArray
    blowbackTargetArray.forEach(function(blowbackCargoTarget){
        blowbackUnresolvedArray = blowbackUnresolvedArray.filter(x=>(!(x[0].attrs.cargoId === blowbackCargoTarget[0].attrs.cargoId)))
        //console.log(` ${stackName} START building blowbackResult: blowbackTargetArray.forEach calling processImpact` + " blowbackTargetArray: " + JSON.stringify(blowbackTargetArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) + " blowbackUnresolvedArray: " + JSON.stringify(blowbackUnresolvedArray.map(x=>x[0].attrs.cargoId))); //tmpdbg
        blowbackResult = blowbackResult.concat(processImpact(blowbackCargoTarget[0], blowbackCargoTarget[1], blowbackCargoTarget[2], 'isWall', blowbackUnresolvedArray, stackName, layerChildren));
    }.bind(this))
    
    //console.log(` ${stackName} END building blowbackResult: ` + JSON.stringify(blowbackResult.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]]))); //tmpdbg
    
    mergeArrays(accumArray, blowbackResult);
    
    // wallCollision == [return [target, targetXPos, targetYPos, wall]]
    if (wallCollision[0][3] === 'isWall') {
        //resolvedArray = wallCollision.concat(resolvedArray, accumArray);
        mergeArrays(resolvedArray, accumArray);
        var temp = wallCollision // am not clobbering wallCollision for no reason
        mergeArrays(temp, resolvedArray);
        // basically I did not realize if a cargo has a wall collision, it may be hit by another cargo in the same chain ,
        // reaction eg. displacing a cargo in the top right corner which then ricocheting back off the right wall
        // so I replaced the concatenation here with merge above.
        //resolvedArray = wallCollision.concat(resolvedArray); 
        resolvedArray = temp;
    } else {
        //resolvedArray = resolvedArray.concat(accumArray);
        mergeArrays(resolvedArray, accumArray);
    }
    //console.log(` ${stackName} returning resolvedArray:` + JSON.stringify(resolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) + "}"); //tmpdbg
    return resolvedArray;
    
}

//nb: both target and layerChildren must have the backing rectangle removed before passed as arguments, because I did not have time to fix this
export function processImpact(target, targetXPos, targetYPos, wallStatus, unresolvedArray, stackName, layerChildren) {
    // target: dragged object,
    var targetRect = target.findOne('Rect').getClientRect();
    // targetRect: target.findOne('Rect').getClientRect();
    // targetXPos: the proposed position of target
    // targetYPos: the proposed position of target
    // unresolvedArray: layerChildren removing walls and removing target
    stackName = stackName + " " + "stackname-" + Math.floor(Math.random() * 991 + 10);
    //console.log(`{${stackName} processImpact called with args: target: ${target.attrs.cargoId}, targetXPos: ${targetXPos}, targetYPos: ${targetYPos}, unresolvedArray: ${JSON.stringify(unresolvedArray.map(x=>x[0].attrs.cargoId))}`);
    
    // Check if target collides with a wall
    // [return [target, targetXPos, targetYPos, wall]]
    // var wallCollision = [processWallCollisions(target, targetXPos, targetYPos)];
    var processWallCollisionsResult = processWallCollisions(target, targetXPos, targetYPos, layerChildren);
    var wallCollision = [processWallCollisionsResult[0]]; // must be wrapped in an array for concatenation 
    var wallLocation = processWallCollisionsResult[1];
    // Clobber local targetXPos and targetYPos if wall collision has occurred,
    // if no collision has occurred then use the new targetX/YPos arguments that have been passed in instead
    if (wallCollision[0][3] === 'isWall') {
        targetXPos = wallCollision[0][1];
        targetYPos = wallCollision[0][2];
        //console.log(` ${stackName} due to a wall collision targetXPos and targetYPos are being clobbered: target.attrs.cargoId: ${target.attrs.cargoId} targetXPos: ${targetXPos} targetYPos: ${targetYPos}`);
    }
    
    var inheritCollision = (wallCollision[0][3] === 'isWall') || (wallStatus === 'isWall')  ? 'isWall' : 'isNotWall'
    
    //resolvedArray is the first wave of collision with target
    // each resolvedArray item has: resolvedArray[0] = collidedItem cargo konva object
    // resolvedArray[0],[1] = assign first wave collisions new X/Y coordinates
    // resolvedArray[2] = 'isWall' if target has collided with wall wallCollision[0][3]==='isWall' above,
    //                     or wallStatus arg = 'isWall' chained forward in processImpact arg due to a target 
    //                     colliding with a wall in the past of the chain
    var resolvedArray = unresolvedArray.map( function(collidedItem) {
        var collidedItemX = collidedItem[1]
        var collidedItemY = collidedItem[2]
        var bareRect = collidedItem[0].findOne('Rect').getClientRect();
        var preCollisionIntersection = haveIntersection(collidedItem, bareRect, targetRect, target.x(), target.y())                
        // var intersectionObj = { intersectionResult: intersectionResult, transform: {x: transformx, y: transformy } };
        var intersection = haveIntersection(collidedItem, bareRect, targetRect, targetXPos, targetYPos)                
        if (intersection.intersectionResult) {
            // If target has collided with wall, push collidedItem in opposite direction of wall
            // else push in direction of axis with smallest overlap
            // The purpose of preCollisionIntersection.transform.x == 0 is to prevent all objects in the 
            // unresolvedArray to be pushed downwards just because the target intersected the wallLocation = 'backWall'
            switch(true) {
            case (wallLocation === 'backWall'  && preCollisionIntersection.transform.x == 0):
                return [collidedItem[0], collidedItemX, targetYPos+targetRect.height+1, inheritCollision];                        
            case (wallLocation === 'rightWall' && preCollisionIntersection.transform.y == 0):
                return [collidedItem[0], targetXPos-bareRect.width-1, collidedItemY, inheritCollision];
            case (wallLocation === 'leftWall' && preCollisionIntersection.transform.y == 0):
                return [collidedItem[0], targetXPos+targetRect.width+1, collidedItemY, inheritCollision];                        
            default: //(wallLocation === 'isNotWall')
                if (Math.abs(intersection.transform.x) < Math.abs(intersection.transform.y)) { // in y direction
                    if(intersection.transform.y < 0) { // above
                        //collidedItem above y transform is -ve
                        return [collidedItem[0], collidedItemX, targetYPos-bareRect.height-1, inheritCollision]
                    } else { // below (0 or more)
                        //collidedItem below y transform is +ve
                        return [collidedItem[0], collidedItemX, targetYPos+targetRect.height+1, inheritCollision]
                    }
                    
                } else { // in x direction
                    if(intersection.transform.x < 0) { // to the left
                        //collidedItem left x transform is -ve
                        return [collidedItem[0], targetXPos-bareRect.width-1, collidedItemY, inheritCollision] 
                    } else { // to the right 0 or more
                        //collidedItem right x transform is +ve
                        return [collidedItem[0], targetXPos+targetRect.width+1, collidedItemY, inheritCollision] 
                    }
                }
            }
        }
    }.bind(this))

    
    // if there are no collisions if (intersection.intersectionResult) {...}
    // will return undefined in the final map result; remove this undefined:
    resolvedArray = resolvedArray.filter(function(el) {return el !== undefined});
    // console.log(` ${stackName} First collision wave completed with target: ` + JSON.stringify(target.attrs.cargoId) +
    //             " unresolvedArray: " + JSON.stringify(unresolvedArray.map(x=>x[0].attrs.cargoId)) +
    //             " resolvedArray: " + JSON.stringify(resolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])));

    
    // accumArray is chain reaction collisions beyond the first wave
    var accumArray = []
    resolvedArray.forEach( function(item) {
        var newTarget = item[0];
        var newTargetXPos = item[1];
        var newTargetYPos = item[2];
        var newUnresolvedArray = unresolvedArray.filter(function(el) {return el[0] !== newTarget});

        // console.log(` ${stackName} START building accumArray: resolvedArray.forEach calling processImpact ` +
        //             " newTarget: " + JSON.stringify(newTarget.attrs.cargoId) +
        //             " newUnresolvedArray: " + JSON.stringify(newUnresolvedArray.map(x=>x[0].attrs.cargoId)));
        
        var newResolvedArray = processImpact(newTarget, newTargetXPos, newTargetYPos, inheritCollision, newUnresolvedArray, stackName, layerChildren);
        accumArray = accumArray.concat(newResolvedArray);

        // console.log(` ${stackName} END building accumArray: resolvedArray.forEach returned from processImpact ` +
        //             " newResolvedArray: " + JSON.stringify(newResolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) +
        //             " accumArray = accumArray.concat(newResolvedArray): " + JSON.stringify(accumArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])));

        
    }.bind(this))
    
    //reprocess accumArray values here
    
    //save all walls returned from processImpact calls
    let blowbackTargetArray = accumArray.filter(x=>x[3]==='isWall')
    
    
    // merge target back to unresolvedArray
    let checkIndex = unresolvedArray.findIndex(x=>(x[0].attrs.cargoId === target.attrs.cargoId))
    
    let blowbackUnresolvedArray = [];
    if(checkIndex >= 0) {
        blowbackUnresolvedArray = unresolvedArray.slice();
        blowbackUnresolvedArray[checkIndex] = [target, targetXPos, targetYPos, wallStatus];
    } else {
        blowbackUnresolvedArray = unresolvedArray.concat([[target, targetXPos, targetYPos, wallStatus]])
    }
    
    let blowbackResult = []
    //call processImpact on every wall blowback cargo as target, with current target added back to unresolvedArray
    blowbackTargetArray.forEach(function(blowbackCargoTarget){
        blowbackUnresolvedArray = blowbackUnresolvedArray.filter(x=>(!(x[0].attrs.cargoId === blowbackCargoTarget[0].attrs.cargoId)))
        // console.log(` ${stackName} START building blowbackResult: blowbackTargetArray.forEach calling processImpact` + " blowbackTargetArray: " + JSON.stringify(blowbackTargetArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) + " blowbackUnresolvedArray: " + JSON.stringify(blowbackUnresolvedArray.map(x=>x[0].attrs.cargoId)));
        blowbackResult = blowbackResult.concat(processImpact(blowbackCargoTarget[0], blowbackCargoTarget[1], blowbackCargoTarget[2], 'isWall', blowbackUnresolvedArray, stackName, layerChildren));
    }.bind(this))
    
    // console.log(` ${stackName} END building blowbackResult: ` + JSON.stringify(blowbackResult.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])));
    
    mergeArrays(accumArray, blowbackResult);
    
    // wallCollision == [return [target, targetXPos, targetYPos, wall]]
    if (wallCollision[0][3] === 'isWall') {
        //resolvedArray = wallCollision.concat(resolvedArray, accumArray);
        mergeArrays(resolvedArray, accumArray);
        var temp = wallCollision // am not clobbering wallCollision for no reason
        mergeArrays(temp, resolvedArray);
        // basically I did not realize if a cargo has a wall collision, it may be hit by another cargo in the same chain ,
        // reaction eg. displacing a cargo in the top right corner which then ricocheting back off the right wall
        // so I replaced the concatenation here with merge above.
        //resolvedArray = wallCollision.concat(resolvedArray); 
        resolvedArray = temp;
    } else {
        //resolvedArray = resolvedArray.concat(accumArray);
        mergeArrays(resolvedArray, accumArray);
    }
    // console.log(` ${stackName} returning resolvedArray:` + JSON.stringify(resolvedArray.map(x=>[x[0].attrs.cargoId, x[1], x[2],x[3]])) + "}");
    return resolvedArray;
    
}

/* eslint-disable */ 
// call example:
// var layerChildren = this.$refs.layer.getNode().getLayer().children;
// var target = layerChildren.find(x=>x.attrs.cargoId === 'cargo-1');
// collision.findOverlaps(target, target.x(), target.y(), layerChildren);
// returns: [KonvaObject, {intersectionResult: true, transform: {x: 25, y: 36}}]
export function findOverlaps(target, targetXPos, targetYPos, layerChildren){
    //console.log("findOverlaps called:");
    var targetRect = target.findOne('Rect').getClientRect();

    //find all intersections with target    
    let layerChildrenNoTarget = layerChildren.filter(el => !(el.attrs.cargoId === target.attrs.cargoId));
    let cargoArray = layerChildrenNoTarget.filter(el => !(el.id() === 'truckWall'))

    let targetIntersectionArray = cargoArray.map(x => [x, haveIntersection([x, x.x(), x.y(), 'isNotWall'], x.findOne('Rect').getClientRect(),
        targetRect, targetXPos, targetYPos)]).filter(x => (x[1].intersectionResult == true));

    // DEBUG:
    // console.log(targetIntersectionArray)
    // if (targetIntersectionArray.length > 0) {
    //     console.log("findOverlaps: some intersection is occuring")
    //     dprt("findOverlaps: return value: ", targetIntersectionArray.map(x=>x[0]));
    //     console.table(targetIntersectionArray.map(x=>[x[0].attrs.cargoId, x[1].intersectionResult, x[1].transform.x, x[1].transform.y]))
    // } else {
    //     console.log("findOverlaps: no intersection is occuring")
    // }
    return  targetIntersectionArray.map(x=>x[0]);
}


export function dedupeStackedCargo(target, layerChildren){
    // target, targetRect, unresolvedArray
    var targetId = target.attrs.cargoId;    
    var targetRect = target.findOne('Rect').getClientRect();
    // cargoGroup elements without targetId
    var cargoGroupArray = layerChildren.filter(el => (el.id() === 'cargoGroup' && !(el.attrs.cargoId === targetId)))
    
    // var resolvedArrayIntersection =
    //     resolvedArray.map(x=>[x[0], haveIntersection([x[0], x[0].x(), x[0].y(), 'isNotWall'],
    //                                                  x[0].findOne('Rect').getClientRect(),
    //                                                  targetRect, target.x(), target.y())]);

    var unresolvedArrayIntersection =
        cargoGroupArray.map(x=>[x, haveIntersection([x, x.x(), x.y(), 'isNotWall'], x.findOne('Rect').getClientRect(),
                                                    targetRect, target.x(), target.y())]);
    // => [[Kobj, {intersectionResult: true, transform: {x: 0, y: 88}}], [Kobj, {intersectionResult: true, transform: {x: 0, y: 6}}]]
    
    // all overlapping cargo below y>=0, right x>0, left x<0, and above y<=0 the target
    var belowArray = unresolvedArrayIntersection.filter(x=>(x[1].intersectionResult == true && x[1].transform.y>0));
    var rightArray = unresolvedArrayIntersection.filter(x=>(x[1].intersectionResult == true && x[1].transform.x>0));
    var leftArray = unresolvedArrayIntersection.filter(x=>(x[1].intersectionResult == true && x[1].transform.x<0));
    var aboveArray = unresolvedArrayIntersection.filter(x=>(x[1].intersectionResult == true && x[1].transform.y<0));
    // => [[Kobj, {intersectionResult: true, transform: {x: 0, y: 88}}], [Kobj, {intersectionResult: true, transform: {x: 0, y: 6}}]]    

    // if transform.y > 0 then the cargo is below the target, remove all cargo except the one with the lowest 
    // precollision y coordinate:
    // sort by y coordinate increasing and remove the smallest element, discard y coordinates from the array
    var dedupeStackedCargoBelow = belowArray.map(x=>[x[0],x[0].y()]).sort((a,b)=>a[1] > b[1] ? 1: -1);
    var dedupeStackedCargoRight = rightArray.map(x=>[x[0],x[0].x()]).sort((a,b)=>a[1] > b[1] ? 1: -1);
    var dedupeStackedCargoLeft = leftArray.map(x=>[x[0],x[0].x()]).sort((a,b)=>a[1] < b[1] ? 1: -1);
    var dedupeStackedCargoAbove = aboveArray.map(x=>[x[0],x[0].y()]).sort((a,b)=>a[1] < b[1] ? 1: -1);

    // dprt("dedupeStackedCargoBelow", dedupeStackedCargoBelow,
    //      "dedupeStackedCargoRight", dedupeStackedCargoRight,
    //      "dedupeStackedCargoLeft", dedupeStackedCargoLeft,
    //      "dedupeStackedCargoAbove", dedupeStackedCargoAbove); //tmpdbg
    // dprt("dedupeStackedCargo return value: ", {above: dedupeStackedCargoAbove, below: dedupeStackedCargoBelow, right: dedupeStackedCargoRight, left: dedupeStackedCargoLeft}) //tmpdbg

    var dedupedResult = {above: dedupeStackedCargoAbove, below: dedupeStackedCargoBelow, right: dedupeStackedCargoRight, left: dedupeStackedCargoLeft}



    return dedupedResult;

}

// update cargoGroupArray with values from piRes
// var piRes = [[{attrs: {cargoId: 'cargo-2'}}, 2, 2, 'isNotWall'],
//              [{attrs: {cargoId: 'cargo-3'}}, 3, 3, 'isNotWall'],
//              [{attrs: {cargoId: 'cargo-5'}}, 5, 5, 'isNotWall'],
//              [{attrs: {cargoId: 'cargo-99'}}, 8, 8, 'isNotWall']]

// var cargoGroupArray = [[{attrs: {cargoId: 'cargo-1'}}, 111, 111, 'isNotWall'],
//                        [{attrs: {cargoId: 'cargo-2'}}, 222, 222, 'isNotWall'],
//                        [{attrs: {cargoId: 'cargo-3'}}, 333, 333, 'isNotWall'],
//                        [{attrs: {cargoId: 'cargo-4'}}, 444, 444, 'isNotWall'],
//                        [{attrs: {cargoId: 'cargo-5'}}, 555, 555, 'isNotWall']]

// updateCargoGroupArray(piRes, cargoGroupArray)
// updates cargoGroupArray coordinate values with values from piRes, where piRes is a processImpact result
// and cargoGroupArray is to be used as the unresolved array in the next iteration of processImpact call
function updateCargoGroupArray (piRes, cargoGroupArray) {
    piRes.forEach(function(resolved) {
        var resolvedId = resolved[0].attrs.cargoId;
        var resolvedX = resolved[1];
        var resolvedY = resolved[2];
        // undefined is falsy
        var foundCargoIndex = cargoGroupArray.findIndex(x=>x[0].attrs.cargoId === resolvedId);
        if(foundCargoIndex >= 0) {
            cargoGroupArray[foundCargoIndex][1] = resolvedX;
            cargoGroupArray[foundCargoIndex][2] = resolvedY;
            
        }
    })}


// for pixel push debugging    
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }    

//export async function pixelPush(layerChildren) {
//nb: both target and layerChildren must have the backing rectangle removed before passed as arguments, because I did not have time to fix this
export function pixelPush(target, layerChildren, saveStartDragCoords) {
    var targetId = target.attrs.cargoId;    
    var targetRect = target.findOne('Rect').getClientRect();
    var cargoGroupArray = layerChildren.filter(el => (el.id() === 'cargoGroup' && !(el.attrs.cargoId === targetId)));
    cargoGroupArray = cargoGroupArray.map(x => [x, x.x(), x.y(), 'isNotWall'])

    // dprt("pixelPush: target: ", target)
    var backWall = layerChildren.find(el => (el.attrs.truckId === 'backWall'))
    var leftWall = layerChildren.find(el => (el.attrs.truckId === 'leftWall'))
    var rightWall = layerChildren.find(el => (el.attrs.truckId === 'rightWall'))
    // + 1 is used to clear the wall width, and it is not necessary to clear the wall when subtracting
    var bottomOfBackWall = backWall.y() + backWall.height() - targetRect.height;
    var rightOfLeftWall = leftWall.x() + leftWall.width() - targetRect.width;
    var leftOfRightWall = rightWall.x() + 1;

    var resWall = processWallCollisions(target, target.x(), target.y(), layerChildren);
    // [[Group, 797, 68, 'isNotWall'], "rightWall"]
    // dprt("pixelPush: processWallCollision result, resWall:", resWall, "resWall[1]", resWall[1])

    //async function pixelPushFromBorder(startWallPushX, startWallPushY, postWallCollisionX, postWallCollisionY) {
    function pixelPushFromBorder(startWallPushX, startWallPushY, postWallCollisionX, postWallCollisionY) {
        // the starting position to the target cargo
        target.x(startWallPushX);
        target.y(startWallPushY);

        //change target.Rect.height/width and testCargo1.x/y(testCargo1.x/y() +/- 1) depending on resWall[1] '?Wall' value
        //also check border overlap by setting it to red

        // reset layerChildrenRemoveWall to include all walls before a single wall is removed again
        var layerChildrenRemoveWall = layerChildren;
        // collidedWall is defined in the calling scope and is equal to resWall[1] // + 1 is required to clear the wall
        for (let i = 0; i < ((collidedWall === 'backWall') ? targetRect.height + 1 : targetRect.width + 1); i++) {
            //for (let i = 0; i < 80; i++) { // 87 ok, 88 fail ; i
            //if (i == 89) { debugger }
            //dprt("targetRect.height", targetRect.height, "targetRect.width", targetRect.width) //tmpdbg
            switch (collidedWall) {
                case 'backWall':
                    target.y(target.y() + 1);
                    layerChildrenRemoveWall = layerChildren.filter(x => !(x.attrs.truckId === 'backWall'))
                    break;
                case 'leftWall':
                    target.x(target.x() + 1);
                    layerChildrenRemoveWall = layerChildren.filter(x => !(x.attrs.truckId === 'leftWall'))
                    break;
                case 'rightWall':
                    target.x(target.x() - 1);
                    layerChildrenRemoveWall = layerChildren.filter(x => !(x.attrs.truckId === 'rightWall'))
                    break;
                default:
                    // 'isNotWall' unreachable from if (!(resWall[1] === 'isNotWall')) calling context 
                    break;
            }

            //processImpact(target, targetXPos, targetYPos, wallStatus, unresolvedArray, stackName, layerChildren)
            //unresolvedArray = unresolvedArray.map(x=>[x, x.x(), x.y(), 'isNotWall']) 
            //piRes = [[Group, 797, 24, 'isNotWall']]
            //cargoGroupArray = cargoGroupArray.map(x=>[x, x.x(), x.y(), 'isNotWall']) 
            var piRes = processImpact(target, target.x(), target.y(),
                'isNotWall',
                // cargoGroupArray is all non wall cargoGroup elements excluding target
                cargoGroupArray,
                "", layerChildrenRemoveWall);
            //await sleep(100); // use requires async keyword in pixelPushFromBorder and outer function pixelPush 
            // You must update cargogrouparray with processImpact results or else collided cargo will keep
            // using the stale konva object coordinates the cargoGroupArray.map call initializes the nested 
            // array values to at the top of this function. These array values are used in the haveIntersection 
            // call in processImpact when computing resolvedArray from unresolved array to allow lazy update
            // of coordinates after processImpact is complete, instead of updating the konva objects directly.
            updateCargoGroupArray(piRes, cargoGroupArray);
            piRes.forEach(function (kgroup) {
                var collidedItem = kgroup[0];
                collidedItem.x(kgroup[1]);
                collidedItem.y(kgroup[2]);
            })
        }

        // [target.findOne(x => x.id() === 'topBorder'),
        //     target.findOne(x => x.id() === 'bottomBorder'),
        //     target.findOne(x => x.id() === 'rightBorder'),
        //     target.findOne(x => x.id() === 'leftBorder')].forEach(x => x.stroke("red"))

    }


    // "Are there wall collisions?"
    if (!(resWall[1] === 'isNotWall')) {
        // find the new post collision position, and pixel push the cargo from the edge of the wall to its final position going in a direction
        // orthogonal to the collided wall
        // pixelPush***
        var collidedWall = resWall[1]
        var postWallCollisionX = resWall[0][1];
        var postWallCollisionY = resWall[0][2];
        switch (collidedWall) {
            case 'backWall':
                var startWallPushX = postWallCollisionX;
                var startWallPushY = bottomOfBackWall
                pixelPushFromBorder(startWallPushX, startWallPushY, postWallCollisionX, postWallCollisionY);
                break;

            case 'leftWall':
                var startWallPushX = rightOfLeftWall;
                var startWallPushY = postWallCollisionY;
                pixelPushFromBorder(startWallPushX, startWallPushY, postWallCollisionX, postWallCollisionY);
                break;

            case 'rightWall':
                var startWallPushX = leftOfRightWall
                var startWallPushY = postWallCollisionY;
                pixelPushFromBorder(startWallPushX, startWallPushY, postWallCollisionX, postWallCollisionY);
                break;

            default:
                // will NOT execute because of containing if condiition: !(resWall[1] === 'isNotWall')
                break;
        }




        // If the final target cargo location is on top of a wall, let the target fall outside the truck on the opposite side of the wall.
        var resWallPostColl = processWallCollisions(target, target.x(), target.y(), layerChildren)
        // [[Group, 797, 40, 'isWall'] "rightWall"]
        let layerChildrenNoTarget = layerChildren.filter(el => !(el.attrs.cargoId === target.attrs.cargoId));
        let cargoArray = layerChildrenNoTarget.filter(el => !(el.id() === 'truckWall'))

        let targetIntersectionArray = cargoArray.map(x => [x, haveIntersection([x, x.x(), x.y(), 'isNotWall'], x.findOne('Rect').getClientRect(),
            targetRect, target.x(), target.y())]).filter(x => (x[1].intersectionResult == true));

        // console.log(resWallPostColl)
        // console.log(targetIntersectionArray)

        if (!(resWallPostColl[1] === 'isNotWall') || targetIntersectionArray.length > 0) {
            // Reposition the cargo on the other side of the wall it collided with
            // CODE2**
            // Note resWallPostColl contains the final objective coordinates for a wall collision
            // target.x() and target.y() are the current coordinates of the target after pixelpushing 
            // has failed
            var collidedWallPostColl = resWallPostColl[1]; // [[Group, 797, 40, 'isWall'] "rightWall"]
            var postFailedCollX = target.x()
            var postFailedCollY = target.y()

            //dprt("pixelPush: resWallPostColl: ", resWallPostColl, "postFailedCollX", postFailedCollX, "postFailedCollY", postFailedCollY) //tmpdbg
            switch (collidedWallPostColl) {
                case 'backWall':
                    target.y(backWall.y() - targetRect.height)
                    break;

                case 'leftWall':
                    target.x(leftWall.x() - targetRect.width)
                    break;

                case 'rightWall':
                    // var failedX = right of rightwall
                    target.x(rightWall.x() + rightWall.width() + 1)
                    break;

                default:
                    // will NOT execute because of containing if condiition: !(resWall[1] === 'isNotWall')
                    break;
            }
            //console.log("CODE2: some intersection is still occuring")
        } else {
            //console.log("CODE2: no intersection is occuring")
        }

        // if there are no wall collisions, check for cargo collisions
    } else {

        //console.log("There are no wall collisions") //tmpdbg


        // do not check wall collisions because wall intersections are impossible in the else condition and are 
        // handled in the above if condition

        // dedupeStackedCargo finds and seperates all collided cargo into above, below, left and right
        var dedupeCargo = dedupeStackedCargo(target, layerChildren)
        // dedupeCargo is: {above: [[Group, 120], [Group, 110]], below: [[Group, 230]], left: [], right: []}

        var totalDedupedElements = dedupeCargo.above.length + dedupeCargo.below.length + dedupeCargo.left.length + dedupeCargo.right.length;

        if (totalDedupedElements > 0) {

            //dprt("CODE3: no wall collisions but cargo collisions were found: sum of directions in dedupeCargo: ", 
            //    (dedupeCargo.above.length + dedupeCargo.below.length + dedupeCargo.left.length + dedupeCargo.right.length)); //tmpdbg
            // At the drop location run dedupeStackedCargo and for each of the 4 transform directions remove all other overlapping cargo and walls
            // and pixelpush in that transform direction for distance of the overlap.
            // CODE3*****

            // var dedupeCargo = dedupeStackedCargo(target, layerChildren)
            // {above: [[Group, 120], [Group, 110]], below: [[Group, 230]], left: [[Group, 325]], right: [[Group, 475]]}

            if (dedupeCargo.above.length > 0) {
                var aboveCargo = dedupeCargo.above[0][0]
                var aboveCargoY = dedupeCargo.above[0][1]
                var aboveCargoRect = aboveCargo.findOne('Rect').getClientRect();
                var startingLocationAbove = aboveCargoY + aboveCargoRect.height + 1;
                var remWallObstructionAbove = processWallCollisions(target, target.x(), startingLocationAbove, layerChildren)[1];
                var layerChildrenRemWallAbove = layerChildren.filter(x => !(x.attrs.truckId === remWallObstructionAbove));

                // obstructionsRight is: ['cargo-3', 'cargo-4', 'cargo-5']
                // cargoGroupArray is defined above as:
                // var cargoGroupArray = layerChildren.filter(el => (el.id() === 'cargoGroup' && !(el.attrs.cargoId === targetId)));
                // cargoGroupArray = cargoGroupArray.map(x => [x, x.x(), x.y(), 'isNotWall'])
                // filter all obstructions out of cargoGroupArray
                var obstructionsAbove = findOverlaps(target, target.x(), startingLocationAbove, layerChildren).map(x => x.attrs.cargoId);
                var cargoGroupArrayAbove = cargoGroupArray.filter((cargo) => !obstructionsAbove.find(obstruction => obstruction === cargo[0].attrs.cargoId));

                var pushDistanceAbove = Math.abs(target.y() - (aboveCargoY + aboveCargoRect.height + 1))
            }

            if (dedupeCargo.below.length > 0) {
                var belowCargo = dedupeCargo.below[0][0]
                var belowCargoY = dedupeCargo.below[0][1]
                var belowCargoRect = belowCargo.findOne('Rect').getClientRect();
                var startingLocationBelow = belowCargoY - targetRect.height - 1;
                var remWallObstructionBelow = processWallCollisions(target, target.x(), startingLocationBelow, layerChildren)[1];
                var layerChildrenRemWallBelow = layerChildren.filter(x => !(x.attrs.truckId === remWallObstructionBelow));

                var obstructionsBelow = findOverlaps(target, target.x(), startingLocationBelow, layerChildren).map(x => x.attrs.cargoId);
                var cargoGroupArrayBelow = cargoGroupArray.filter((cargo) => !obstructionsBelow.find(obstruction => obstruction === cargo[0].attrs.cargoId));

                var pushDistanceBelow = Math.abs((target.y() + targetRect.height + 1) - belowCargoY)
            }

            if (dedupeCargo.left.length > 0) {
                var leftCargo = dedupeCargo.left[0][0]
                var leftCargoX = dedupeCargo.left[0][1]
                var leftCargoRect = leftCargo.findOne('Rect').getClientRect();
                var startingLocationLeft = leftCargoX + leftCargoRect.width + 1;
                var remWallObstructionLeft = processWallCollisions(target, startingLocationLeft, target.y(), layerChildren)[1];
                var layerChildrenRemWallLeft = layerChildren.filter(x => !(x.attrs.truckId === remWallObstructionLeft));

                var obstructionsLeft = findOverlaps(target, startingLocationLeft, target.y(), layerChildren).map(x => x.attrs.cargoId);
                var cargoGroupArrayLeft = cargoGroupArray.filter((cargo) => !obstructionsLeft.find(obstruction => obstruction === cargo[0].attrs.cargoId))

                var pushDistanceLeft = Math.abs(target.x() - (leftCargoX + leftCargoRect.width + 1))
            }

            if (dedupeCargo.right.length > 0) {
                var rightCargo = dedupeCargo.right[0][0]
                var rightCargoX = dedupeCargo.right[0][1]
                var rightCargoRect = rightCargo.findOne('Rect').getClientRect();
                var startingLocationRight = rightCargoX - targetRect.width - 1;
                // find any walls which may be impacted when placing the target at its' startingLocation and remove it
                var remWallObstructionRight = processWallCollisions(target, startingLocationRight, target.y(), layerChildren)[1];
                var layerChildrenRemWallRight = layerChildren.filter(x => !(x.attrs.truckId === remWallObstructionRight));

                var obstructionsRight = findOverlaps(target, startingLocationRight, target.y(), layerChildren).map(x => x.attrs.cargoId);
                var cargoGroupArrayRight = cargoGroupArray.filter((cargo) => !obstructionsRight.find(obstruction => obstruction === cargo[0].attrs.cargoId))

                var pushDistanceRight = Math.abs((target.x() + targetRect.width + 1) - rightCargoX);
            }

            // dprt("pixelPush: pushDistances before: [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft]: ",
            //     [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft]); //tmpdbg

            function orthPixelPush(dir, startingLocation, pushDistance, orthCargoGroupArray, layerChildrenRemWallObstruction) {
                //dprt("pixelPush: orthPixelPush: dir", dir, " has pushDistance: ", pushDistance, " and has startingLocation: ", startingLocation); //tmpdbg

                //startingLocation must be applied after pushDistance is computed, because pushDistance depends on the target's
                //coordinates to compute overlap before pixel pushing begins
                // target.y(startingLocation); // above or below
                // target.x(startingLocation); // right or left
                switch (true) {
                    case ((dir === 'above') || (dir === 'below')):
                        target.y(startingLocation); // above or below
                        break;
                    case ((dir === 'right') || (dir === 'left')):
                        target.x(startingLocation); // right or left
                        break;
                    default:
                        // no other keys exist
                        break;
                }

                for (let i = 0; i < pushDistance; i++) {
                    var targetPrePushX = target.x()
                    var targetPrePushY = target.y()
                    //dprt("pixelPush: orthPixelPush: [targetPrePushX, targetPrePushY]", [targetPrePushX, targetPrePushY]) //tmpdbg
                    
                    switch (dir) {
                        case 'above':
                            target.y(target.y() - 1);
                            pushDistanceAbove = pushDistanceAbove - 1;
                            break;
                        case 'below':
                            target.y(target.y() + 1);
                            pushDistanceBelow = pushDistanceBelow - 1;
                            break;
                        case 'right':
                            target.x(target.x() + 1);
                            pushDistanceRight = pushDistanceRight - 1;
                            break;
                        case 'left':
                            target.x(target.x() - 1);
                            pushDistanceLeft = pushDistanceLeft - 1;
                            break;
                        default:
                            // no other keys exist
                            break;
                    }

                    // above: below: right: left:, cargoGroupArray{Above, Below, Left, Right}:
                    var orthPiRes = processImpact(target, target.x(), target.y(), 'isNotWall', orthCargoGroupArray, "", layerChildrenRemWallObstruction)
                    //dprt("pixelPush: orthPixelPush: [dir, orthPiRes]", [dir, JSON.stringify(orthPiRes.map(x => [x[0].attrs.cargoId, x[1], x[2], x[3]]))]); //tmpdbg

                    //await sleep(100); // use requires async keyword in pixelPushFromBorder and outer function pixelPush 
                    // You must update cargogrouparray with processImpact results or else collided cargo will keep
                    // using the stale konva object coordinates the cargoGroupArray.map call initializes the nested 
                    // array values to at the top of this function. These array values are used in the haveIntersection 
                    // call in processImpact when computing resolvedArray from unresolved array to allow lazy update
                    // of coordinates after processImpact is complete, instead of updating the konva objects directly.
                    // above: below: right: left:, cargoGroupArray{Above, Below, Left, Right}:
                    updateCargoGroupArray(orthPiRes, orthCargoGroupArray);
                    orthPiRes.forEach(function (kgroup) {
                        var collidedItem = kgroup[0];
                        collidedItem.x(kgroup[1]);
                        collidedItem.y(kgroup[2]);
                    })

                    var targetPostPushX = target.x()
                    var targetPostPushY = target.y()
                    //dprt("pixelPush: orthPixelPush: [targetPostPushX, targetPostPushY]", [targetPostPushX, targetPostPushY]) //tmpdbg
                    if (targetPrePushX == targetPostPushX && targetPrePushY == targetPostPushY) {
                        switch (dir) {
                            case 'above':
                                if (!(pushDistanceBelow === undefined)) { pushDistanceBelow = pushDistanceBelow + 1; }
                                //dprt("pixelPush: orthPixelPush: opposite pushDistanceBelow increased: ", pushDistanceBelow) //tmpdbg
                                break;
                            case 'below':
                                if (!(pushDistanceAbove === undefined)) { pushDistanceAbove = pushDistanceAbove + 1; }
                                //dprt("pixelPush: orthPixelPush: opposite pushDistanceAbove increased: ", pushDistanceAbove) //tmpdbg
                                break;
                            case 'right':
                                if (!(pushDistanceLeft === undefined)) { pushDistanceLeft = pushDistanceLeft + 1; }
                                //dprt("pixelPush: orthPixelPush: opposite pushDistanceLeft increased: ", pushDistanceLeft) //tmpdbg
                                break;
                            case 'left':
                                if (!(pushDistanceRight === undefined)) { pushDistanceRight = pushDistanceRight + 1; }
                                //dprt("pixelPush: orthPixelPush: opposite pushDistanceRight increased: ", pushDistanceRight) //tmpdbg
                                break;
                            default:
                                // no other keys exist
                                break;
                        }
                    } else {
                        // update the starting location to follow the moved cargo in case it must be repushed in the round robin below
                        switch (dir) {
                            case 'above':
                                if (!(startingLocationAbove === undefined)) { startingLocationAbove = startingLocationAbove - 1; }
                                //dprt("pixelPush: orthPixelPush: in same dir startingLocationAbove increased: ", startingLocationAbove) //tmpdbg
                                break;
                            case 'below':
                                if (!(startingLocationBelow === undefined)) { startingLocationBelow = startingLocationBelow + 1; }
                                //dprt("pixelPush: orthPixelPush: in same dir startingLocationBelow increased: ", startingLocationBelow) //tmpdbg
                                break;
                            case 'right':
                                if (!(startingLocationRight === undefined)) { startingLocationRight = startingLocationRight + 1; }
                                //dprt("pixelPush: orthPixelPush: in same dir startingLocationRight increased: ", startingLocationRight) //tmpdbg
                                break;
                            case 'left':
                                if (!(startingLocationLeft === undefined)) { startingLocationLeft = startingLocationLeft - 1; }
                                //dprt("pixelPush: orthPixelPush: in same dir startingLocationLeft increased: ", startingLocationLeft) //tmpdbg
                                break;
                            default:
                                // no other keys exist
                                break;
                        }
                    }
                }
            }

            var bedRockCount = 0            
            while (pushDistanceAbove > 0 || pushDistanceBelow > 0 || pushDistanceRight > 0 || pushDistanceLeft > 0) {
                if((pushDistanceAbove == 0 || pushDistanceBelow == 0 || pushDistanceRight == 0 || pushDistanceLeft == 0)) {
                    bedRockCount = bedRockCount + 1;
                    // dprt("one pushDistance has hit zero: [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft, bedRockCount]", 
                    //       [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft, bedRockCount]); //tmpdbg
                    if(bedRockCount == 20){
                        //console.log("pixelPush: ERROR: bedRockCount == 20; abandoning collision resolution"); //tmpdbg
                        break;    
                    }
                }
                for (const dir in dedupeCargo) {
                    if (dedupeCargo[dir].length > 0) {
                        switch (dir) {
                            case 'above':
                                orthPixelPush('above', startingLocationAbove, pushDistanceAbove, cargoGroupArrayAbove, layerChildrenRemWallAbove);
                                break;
                            case 'below':
                                orthPixelPush('below', startingLocationBelow, pushDistanceBelow, cargoGroupArrayBelow, layerChildrenRemWallBelow);
                                break;
                            case 'right':
                                orthPixelPush('right', startingLocationRight, pushDistanceRight, cargoGroupArrayRight, layerChildrenRemWallRight)
                                break;
                            case 'left':
                                orthPixelPush('left', startingLocationLeft, pushDistanceLeft, cargoGroupArrayLeft, layerChildrenRemWallLeft);
                                break;
                            default:
                                // no other keys exist    
                                break;
                        }
                    }
                }
            }            
            // dprt("pixelPush: pushDistances after: [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft]: ",
            //     [pushDistanceAbove, pushDistanceBelow, pushDistanceRight, pushDistanceLeft]); //tmpdbg
            var finalCheckCargo = findOverlaps(target, target.x(), target.y(), layerChildren)
            // [Group1, Group2, ...]
            var finalCheckWalls = processWallCollisions(target, target.x(), target.y(), layerChildren);
            // [[Group, 797, 68, 'isNotWall'], "rightWall"]

            if (finalCheckCargo.length > 0 || !(finalCheckWalls[1] === 'isNotWall')) {
                target.x(saveStartDragCoords.x);
                target.y(saveStartDragCoords.y);
            }
            //dprt("pixelPush finalCheck Result: [finalCheckCargo, finalCheckWalls]", [finalCheckCargo, finalCheckWalls]) //tmpdbg
        }
    }
}


/* eslint-enable */



