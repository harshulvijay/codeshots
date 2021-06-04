import type { FunctionalComponent, VNode } from 'preact'

/**
 * Type alias for the function signature of a functional component
 */
export type FnComp<PropType = {}> = FunctionalComponent<PropType>

/**
 * Type alias for the return type of a functional component
 */
export type FnCompRetType = VNode<any> | null
