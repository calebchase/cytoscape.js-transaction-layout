export default function getInverseList(eles) {
    let count = eles.length;
    let curSide = 0;
    let curArrDim = 2;
    let arrDim = Math.ceil(Math.sqrt(count));
    let isSquare = arrDim == Math.sqrt(count);

    let arr = [];
    for (let i = 0; i < arrDim + 1; i++) arr.push([]);

    let eleIndex = 0;
    for (let i = 0; eleIndex < count; i++) {
        for (let j = 0; j < arrDim; j++) {
            if (
                i != 0 &&
                count - eleIndex - 1 != 0 &&
                (count - eleIndex) % (arrDim - 1) == 0 &&
                !isSquare &&
                j + 1 == arrDim
            ) {
                continue;
            } else if (eleIndex < count) {
                arr[i][j] = eles[eleIndex];
                eleIndex++;
            }
        }
    }

    for (let i = 0; i < count; i++) {
        if (i == 0 || i == 1) {
            eles[i] = arr[0][i];
        } else if (curSide % 2 == 0) {
            // insert Bottom
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                if (arr[curSide / 2 + 1][j] != undefined) eles[i] = arr[curSide / 2 + 1][j];
                else i--;
            }
            i--;
            curSide++;
        } else {
            // insert left
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                if ((eles[i] = arr[j][curArrDim] != undefined)) eles[i] = arr[j][curArrDim];
                else i--;
            }
            i--;
            curSide++;
            curArrDim++;
        }
    }
    return eles;
}
