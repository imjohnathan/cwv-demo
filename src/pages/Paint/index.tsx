import { Button } from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import p5 from "p5";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const Paint: React.FC = observer(() => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState<string>("black");
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let bg: p5.Image | undefined;
      p.preload = () => {
        bg = p.loadImage(
          "/bg.jpg",
          (img) => {
            console.log("Image loaded successfully");
          },
          (err) => {
            console.error("Failed to load image:", err);
          },
        );
      };

      p.setup = () => {
        const canvas = p.createCanvas(700, 500);
        canvasRef.current = canvas.elt;
        if (bg) {
          p.image(bg, 0, 0, p.width, p.height);
        }
        const borderWidth = 1;
        p.stroke(0);
        p.strokeWeight(borderWidth);
        p.rect(
          borderWidth / 2,
          borderWidth / 2,
          p.width - borderWidth,
          p.height - borderWidth,
        );
      };

      const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
        const strokeColor = isEraser ? p.color(255, 255, 255) : p.color(color);
        p.stroke(strokeColor);
        p.strokeWeight(isEraser ? 10 : 2);
        p.line(x0, y0, x1, y1);
      };

      p.mouseDragged = () => {
        drawLine(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      };

      p.mousePressed = () => {
        drawLine(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
      };
    };

    if (sketchRef.current && !p5Instance) {
      setP5Instance(new p5(sketch, sketchRef.current));
    }
  }, []);

  useEffect(() => {
    if (p5Instance) {
      p5Instance.mouseDragged = () => {
        const strokeColor = isEraser
          ? p5Instance.color(255)
          : p5Instance.color(color);
        p5Instance.stroke(strokeColor);
        p5Instance.strokeWeight(isEraser ? 6 : 2);
        p5Instance.line(
          p5Instance.pmouseX,
          p5Instance.pmouseY,
          p5Instance.mouseX,
          p5Instance.mouseY,
        );
      };

      p5Instance.mousePressed = () => {
        const strokeColor = isEraser
          ? p5Instance.color(255)
          : p5Instance.color(color);
        p5Instance.stroke(strokeColor);
        p5Instance.strokeWeight(isEraser ? 10 : 2);
        p5Instance.point(p5Instance.mouseX, p5Instance.mouseY);
      };
    }
  }, [color, isEraser, p5Instance]);
  const saveDrawing = () => {
    if (p5Instance) {
      p5Instance.saveCanvas("myDrawing", "png");
    }
  };
  const saveAndUploadDrawing = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          console.error("無法辨識圖片");
          return;
        }
        const file = new File([blob], "drawing.png", { type: "image/png" });
        try {
          const imageUrl = await uploadImage(file);
          await updateAvatarUrl(imageUrl);
          alert("上傳成功");
        } catch (error) {
          console.error("上傳失敗", error);
        }
      });
    }
  };
  const auth = getAuth();
  const updateAvatarUrl = async (imageUrl: string) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const db = getFirestore();
    const userDocRef = doc(db, "user", userEmail);
    await updateDoc(userDocRef, { avatar: imageUrl });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name + v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  return (
    <>
      <div className="m-auto mb-10 mt-28 w-3/4 border border-stone-800 p-4">
        <div className="flex justify-center ">
          {isEraser ? (
            <Button
              className="mb-4 border border-stone-800 bg-white"
              onClick={() => setIsEraser(!isEraser)}
            >
              <p className="text-stone-800">
                {isEraser ? "使用畫筆" : "使用橡皮擦"}
              </p>
            </Button>
          ) : (
            <Button
              className=" mb-4 bg-stone-800 text-center "
              onClick={() => setIsEraser(!isEraser)}
            >
              <p className="text-white">
                {isEraser ? "使用畫筆" : "使用橡皮擦"}
              </p>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button color="default" onClick={() => setColor("black")}>
            黑色
          </Button>
          <Button color="primary" onClick={() => setColor("blue")}>
            藍色
          </Button>
          <Button color="success" onClick={() => setColor("green")}>
            綠色
          </Button>
          <Button color="danger" onClick={() => setColor("red")}>
            紅色
          </Button>
        </div>
      </div>
      <div ref={sketchRef} className=" mb-10 flex justify-center"></div>
      <div className="mb-40 mt-4 flex justify-center gap-2">
        <Button onClick={saveDrawing}>下載作品</Button>
        <Button onClick={saveAndUploadDrawing}>設定為頭貼</Button>
      </div>
    </>
  );
});

export default Paint;
