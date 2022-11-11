import { useRef, useState } from "react";

export default function useRectangle() {
    const [rect,setRect] = useState({})
    const rect_ref = useRef()
    let start = {x:0,y:0}
    let move = {x:0,y:0}
    let ismousedown = false
    let isanimate = false
    
    //events
    const __onMouseDown = e => {
        //フラグの更新
        isanimate = true
        ismousedown = true
        
        //座標の更新
        start["x"] = e.nativeEvent.offsetX
        start["y"] = e.nativeEvent.offsetY
        
        //styleの更新
        rect_ref.current.style.cssText = "position:relative;";

        //矩形エリアの描画
        let rect_area = document.createElement("div")
        rect_area.classList.add("rect-area")
        rect_area.style.cssText = 
            "border: 2px dotted red;"+
            "background-color: rgba(0,0,0,0.3);"+
            "position: absolute;"+
            `top:${start["y"]}px;`+
            `left:${start["x"]}px;`+
            `width:0px;`+
            `height:0px;`
        rect_ref.current.appendChild(rect_area)

        animate()
    }
    const __onMouseMove = e => {
        if(!ismousedown) return

        //座標の更新
        move["x"] = e.nativeEvent.offsetX - start["x"]
        move["y"] = e.nativeEvent.offsetY - start["y"]
    }
    const __onMouseUp = e => {
        //フラグ更新
        ismousedown = false
        isanimate = false

        setRect(() => {return {
            start:{x:start["x"],y:start["y"]},
            end:{x:move["x"] + start["x"],y:move["y"] + start["y"]}
        }})
        rect_ref.current.style.cssText = "opacity:1;position:relative;";
    }

    function animate(){
        if(!isanimate) return

        //矩形エリアの再描画
        let rect_area = document.querySelector(".rect-area")
        rect_area.style.width = move["x"] + "px"
        rect_area.style.height = move["y"] + "px"

        setTimeout(animate, 500);
    }

    //delete
    const delRect = () => {
        let rect_area = document.querySelector(".rect-area")
        rect_ref.current.removeChild(rect_area)
    }

    return [
        rect,
        delRect,
        {
            ref:rect_ref,
            onMouseDown:__onMouseDown,
            onMouseUp:__onMouseUp,
            onMouseMove:__onMouseMove
        }
    ]
}