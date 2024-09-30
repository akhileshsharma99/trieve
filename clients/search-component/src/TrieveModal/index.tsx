import React, { Fragment, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import r2wc from "@r2wc/react-to-web-component";
import { SearchMode } from "./SearchMode";
import { ChatMode } from "./ChatMode";
import { ArrowDownKey, ArrowUpIcon, EnterKeyIcon, EscKeyIcon } from "./icons";

import {
  ModalProps,
  ModalProvider,
  useModalState,
} from "../utils/hooks/modal-context";
import { useKeyboardNavigation } from "../utils/hooks/useKeyboardNavigation";
import { ModeSwitch } from "./ModeSwitch";

const Modal = () => {
  useKeyboardNavigation();
  const { mode, modalRef, open, setOpen, setMode, props } = useModalState();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tv-prop-brand-color",
      props.brandColor ?? "#CB53EB"
    );
  }, [props.brandColor]);

  const keyCombo = props.openKeyCombination || [{ ctrl: true }, { key: "k" }];

  const ButtonEl = props.ButtonEl;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setMode("search");
      }}>
      <Dialog.Trigger asChild>
        {ButtonEl ? (
          <button type="button">
            <ButtonEl />
          </button>
        ) : (
          <button
            id="open-trieve-modal"
            type="button"
            className={props.theme === "dark" ? "dark scrollbar-track-rounded-md scrollbar-thumb-rounded-md" : "scrollbar-track-rounded-md scrollbar-thumb-rounded-md"}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <div>{props.placeholder}</div>
            </div>
            <span className="open">
              {keyCombo.map((key) => (
                <Fragment key={key.key}>
                  {key.ctrl ? (
                    <>
                      <span className="mac">⌘ </span>
                      <span className="not-mac">Ctrl </span>
                    </>
                  ) : (
                    <span>
                      {" "}
                      {keyCombo.length > 1 ? "+" : null} {key.label || key.key}
                    </span>
                  )}
                </Fragment>
              ))}
            </span>
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.DialogTitle className="sr-only">Search</Dialog.DialogTitle>
        <Dialog.DialogDescription className="sr-only">
          Search or ask an AI
        </Dialog.DialogDescription>
        <Dialog.Overlay id="trieve-search-modal-overlay" />
        <Dialog.Content
          id="trieve-search-modal"
          ref={modalRef}
          style={{scrollbarWidth: "thin" }}
          className={(mode === "chat" ? "chat-modal-mobile " : " ") + (props.theme === "dark" ? "dark " : "")}>
          <ModeSwitch />
          <div style={{ display: mode === "search" ? "block" : "none" }}>
            <SearchMode />
          </div>
          <div
            className={(mode === "chat" ? "w-full h-full chat-container" : " ")}
            style={{ display: mode === "chat" ? "block" : "none" }}>
            <ChatMode />
          </div>
          <div className="footer">
            <ul className="commands">
              <li>
                <kbd className="commands-key">
                  <EnterKeyIcon />
                </kbd>
                <span className="label">to select</span>
              </li>
              <li>
                <kbd className="commands-key">
                  <ArrowDownKey />
                </kbd>
                <kbd className="commands-key">
                  <ArrowUpIcon />
                </kbd>
                <span className="label">to navigate</span>
              </li>
              <li>
                <kbd className="commands-key">
                  <EscKeyIcon />
                </kbd>
                <span className="label">to close</span>
              </li>
            </ul>

            <a
              className="trieve-powered"
              href="https://trieve.ai"
              target="_blank">
              <img src="https://cdn.trieve.ai/trieve-logo.png" alt="logo" />
              Powered by Trieve
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const initTrieveModalSearch = (props: ModalProps) => {
  const ModalSearchWC = r2wc(() => <TrieveModalSearch {...props} />);

  if (!customElements.get("trieve-modal-search")) {
    customElements.define("trieve-modal-search", ModalSearchWC);
  }
};

export const TrieveModalSearch = (props: ModalProps) => {
  return (
    <ModalProvider onLoadProps={props}>
      <Modal />
    </ModalProvider>
  );
};
