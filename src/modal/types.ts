import type { HTMLMotionProps } from "motion/react";
import type { ComponentProps, ComponentType, CSSProperties, PropsWithChildren } from "react";

export type ModalComponents = Record<string, ComponentType<any>>;

type ModalsWithoutRequiredProps<Modals extends ModalComponents> = {
  [Name in keyof Modals]: {} extends ComponentProps<Modals[Name]> ? Name : never;
}[keyof Modals];

export type OpenModalArgs<Modals extends ModalComponents> = {
  [Name in keyof Modals]: {} extends ComponentProps<Modals[Name]>
    ? [name: Name, props?: ComponentProps<Modals[Name]>]
    : [name: Name, props: ComponentProps<Modals[Name]>];
}[keyof Modals];

export type OpenModal<Modals extends ModalComponents> = {
  [Name in keyof Modals]: {
    name: Name;
    props: ComponentProps<Modals[Name]>;
  };
}[keyof Modals];

export type OpenModals<Modals extends ModalComponents> = OpenModal<Modals>[];

export type ModalProviderProps<Modals extends ModalComponents> = PropsWithChildren<{
  /** The modal components that can be opened. */
  modals: Modals;
  /** The background color of the modal content. */
  modalBackgroundColor?: CSSProperties["backgroundColor"];
  /** The background color of the modal backdrop. */
  modalBackdropColor?: CSSProperties["backgroundColor"];
  /** The class name of the modal backdrop. */
  modalBackdropClassName?: string;
}>;

export type ModalProps = HTMLMotionProps<"div">;

export type ModalContextType<Modals extends ModalComponents> = {
  /** The background color of the modal content. */
  modalBackgroundColor: CSSProperties["backgroundColor"];
  /** The background color of the modal backdrop. */
  modalBackdropColor: CSSProperties["backgroundColor"];
  /** The class name of the modal backdrop. */
  modalBackdropClassName?: string;
  /** Closes a modal with the given name. */
  close: (name: keyof Modals) => void;
  /** Closes all open modals. */
  closeAll: () => void;
  /** Closes the most recently opened modal. */
  pop: () => void;
  /** Opens a modal with the given name and props. */
  open: {
    /** Opens a modal with the given name and props. */
    <Name extends keyof Modals>(name: Name, props: ComponentProps<Modals[Name]>): void;
    /** If a modal doesn't require any props, it can be opened with just the name. */
    <Name extends ModalsWithoutRequiredProps<Modals>>(name: Name): void;
  };
};
