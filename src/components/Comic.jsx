import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

import cover from "../images/comics/cover.PNG";
import page1 from "../images/comics/01.PNG";
import page2 from "../images/comics/02.PNG";
import page3 from "../images/comics/03.PNG";
import page4 from "../images/comics/04.PNG";
import page5 from "../images/comics/05.PNG";
import page6 from "../images/comics/06.PNG";
import page7 from "../images/comics/07.PNG";
import page8 from "../images/comics/08.PNG";
import pageButton1 from "../images/comics/ui/1.PNG"
import pageButton2 from "../images/comics/ui/2.PNG"
import pageButton3 from "../images/comics/ui/3.PNG"
import pageButton4 from "../images/comics/ui/4.PNG"
import pageButton5 from "../images/comics/ui/5.PNG"
import pageButton6 from "../images/comics/ui/6.PNG"
import pageButton7 from "../images/comics/ui/7.PNG"
import pageButton8 from "../images/comics/ui/8.PNG"
import pageButton9 from "../images/comics/ui/9.PNG"
import nextPage from "../images/comics/ui/nextPage.PNG";
import prevPage from "../images/comics/ui/prevPage.PNG";

const Page = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      data-density={props.cover && "hard"}
      className="w-full h-full"
    >
      {props.children}
    </div>
  );
});

const Comic = () => {
  const book = useRef();

  return (
    <>
      <HTMLFlipBook
        width={400}
        height={400}
        ref={book}
        showCover
      >
        <Page cover>
          <img src={cover} alt="" />
        </Page>
        <Page>
          <img src={page1} alt="" />
        </Page>
        <Page>
          <img src={page2} alt="" />
        </Page>
        <Page>
          <img src={page3} alt="" />
        </Page>
        <Page>
          <img src={page4} alt="" />
        </Page>
        <Page>
          <img src={page5} alt="" />
        </Page>
        <Page>
          <img src={page6} alt="" />
        </Page>
        <Page>
          <img src={page7} alt="" />
        </Page>
        <Page>
          <img src={page8} alt="" />
        </Page>
      </HTMLFlipBook>
      <div className="flex justify-center gap-3 mt-4 mb-4">
        <button onClick={() => book.current.pageFlip().flipPrev()}>
          <img src={prevPage} alt="" />
        </button>
        <button onClick={() => book.current.pageFlip().flip(0)}>
          <img src={pageButton1} alt="" />
        </button>
        {/* <button onClick={() => book.current.pageFlip().flip(1)}>
          <img src={pageButton2} alt="" />
        </button> */}
        <button onClick={() => book.current.pageFlip().flip(2)}>
          <img src={pageButton3} alt="" />
        </button>
        {/* <button onClick={() => book.current.pageFlip().flip(3)}>
          <img src={pageButton4} alt="" />
        </button> */}
        <button onClick={() => book.current.pageFlip().flip(4)}>
          <img src={pageButton5} alt="" />
        </button>
        {/* <button onClick={() => book.current.pageFlip().flip(5)}>
          <img src={pageButton6} alt="" />
        </button> */}
        <button onClick={() => book.current.pageFlip().flip(6)}>
          <img src={pageButton7} alt="" />
        </button>
        {/* <button onClick={() => book.current.pageFlip().flip(7)}>
          <img src={pageButton8} alt="" />
        </button> */}
        <button onClick={() => book.current.pageFlip().flip(8)}>
          <img src={pageButton9} alt="" />
        </button>
        <button onClick={() => book.current.pageFlip().flipNext()}>
          <img src={nextPage} alt="" />
        </button>
      </div>
    </>
  );
};

export default Comic;
