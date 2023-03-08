/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/role-has-required-aria-props */
import { Component, h, Prop, State, Watch } from '@stencil/core';

import { Generic } from '@a11y-ui/core';
import { Stringified } from '../../types/common';
import { nonce } from '../../utils/dev.utils';
import { setState, watchBoolean, watchJsonArrayString, watchString } from '../../utils/prop.validators';
import { KolButton } from '../button/shadow';
import { spawn } from 'child_process';

type TreeNode = {
	_expanded?: boolean;
	_id: string;
	_key: string;
	_label: string;
	_nodes: TreeNode[];
};

/**
 * API
 */
type RequiredProps = {
	id: string;
	key: string;
	label: string;
	nodes: Stringified<TreeNode[]>;
};
type OptionalProps = {
	expanded?: boolean;
};
export type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = {
	expanded: boolean;
	id: string;
	key: string;
	label: string;
	nodes: TreeNode[];
	domNode: TreeNode | null;
	treeitems: TreeNode | null;
	firstChars: TreeNode | null;
	firstTreeitem: TreeNode | null;
	lastTreeitem: TreeNode | null;
} & OptionalProps;
type OptionalStates = unknown;
export type States = Generic.Element.Members<RequiredStates, OptionalStates>;

@Component({
	tag: 'kol-tree',
	styleUrls: {
		default: './style.css',
	},
	shadow: true,
})
export class KolTree implements Generic.Element.ComponentApi<RequiredProps, OptionalProps, RequiredStates, OptionalStates> {
	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop() public _id!: string;

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop() public _key!: string;

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop() public _label!: string;

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop() public _nodes!: Stringified<TreeNode[]>;

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop({ mutable: true, reflect: true }) public _expanded?: boolean = false;

	@State() public state: States = {
		_expanded: false,
		_id: nonce(),
		_key: '',
		_label: '',
		_nodes: [],
		_domNode: null,
		_treeitems: null,
		_firstChars: null,
		_firstTreeitem: null,
		_lastTreeitem: null,
	};

	@Watch('_id')
	public validateId(value?: string): void {
		watchString(this, '_id', value);
	}

	@Watch('_key')
	public validateKey(value?: string): void {
		watchString(this, '_key', value);
	}

	@Watch('_label')
	public validateLabel(value?: string): void {
		watchString(this, '_label', value);
	}

	@Watch('_nodes')
	public validateNodes(value?: Stringified<TreeNode[]>): void {
		watchJsonArrayString(this, '_nodes', (node) => typeof node === 'object' && typeof node._label === 'string', value);
	}

	@Watch('_expanded')
	public validateExpanded(value?: boolean): void {
		watchBoolean(this, '_expanded', value);
	}

	private init() {
		console.log('==========');
		console.log('initialize tree-component -> _nodes');
		console.log(this.state._nodes);
		console.log('----------');

		// const nodes = this.state._nodes ? this.state._nodes((node: TreeNode) => { ...node, '_tabIndex': 0 }) : []

		console.log('==========');
	}

	private setFocusToItem(treeitem: TreeNode) {
		console.log('---------- setFocusToItem ----------', treeitem._key);
		console.log(treeitem);
		for (let i = 0; i < this.state._nodes.length; i++) {
			const ti = this.state._nodes[i];
			console.log('-----', ti === treeitem);
			console.log(ti);
			/*
			if (ti === treeitem) {
				ti.tabIndex = 0;
				ti.focus();
			} else {
				ti.tabIndex = -1;
			}
			*/
		}
	}

	private setFocusToNextItem(currentItem: TreeNode) {
		console.log('---------- setFocusToNextItem ----------', currentItem._key);
		console.log(currentItem);
		/*
		const nextItem = false;

		for (let i = this.state._treeitems.length - 1; i >= 0; i--) {
			const ti = this.state._treeitems[i];
			if (ti === currentItem) {
				break;
			}
			if (ti.isVisible) {
				nextItem = ti;
			}
		}

		if (nextItem) {
			this.setFocusToItem(nextItem);
		}
		*/
	}

	private setFocusToPreviousItem(currentItem: TreeNode) {
		console.log('---------- setFocusToPreviousItem ----------', currentItem._key);
		console.log(currentItem);
		/*
		const prevItem = false;

		for (let i = 0; i < this.state._treeitems.length; i++) {
			const ti = this.state._treeitems[i];
			if (ti === currentItem) {
				break;
			}
			if (ti.isVisible) {
				prevItem = ti;
			}
		}

		if (prevItem) {
			this.setFocusToItem(prevItem);
		}
		*/
	}

	private setFocusToParentItem(currentItem: TreeNode) {
		console.log('---------- setFocusToParentItem ----------', currentItem._key);
		console.log(currentItem);
		/*
		if (currentItem.groupTreeitem) {
			this.setFocusToItem(currentItem.groupTreeitem);
		}
		*/
	}

	private setFocusToFirstItem() {
		console.log('---------- setFocusToFirstItem ----------');
		// this.setFocusToItem(this.state._firstTreeitem);
	}

	private toggleOnClick(node: TreeNode, event: MouseEvent): void {
		event.preventDefault();
		event.stopImmediatePropagation();

		this.toggleExpandedStatus(node);
	}

	private toggleOnKeyDown(node: TreeNode, event: KeyboardEvent): void {
		console.log('toggleOnKeyDown -> key', event.key);
		console.log(node);
		event.preventDefault();
		event.stopImmediatePropagation();

		switch (event.key) {
			case 'Enter':
				console.log('Enter');
				this.toggleExpandedStatus(node);
				break;
			case 'ArrowLeft':
				console.log('ArrowLeft');
				if (node._expanded) {
					this.toggleExpandedStatus(node);
				}
				break;
			case 'ArrowRight':
				console.log('ArrowRight');
				if (!node._expanded) {
					this.toggleExpandedStatus(node);
					this.setFocusToItem(node);
				}
				this.setFocusToNextItem(node);
				break;
			case 'ArrowUp':
				console.log('ArrowUp');
				this.setFocusToPreviousItem(node);
				break;
			case 'ArrowDown':
				console.log('ArrowDown');
				this.setFocusToNextItem(node);
				break;
			default:
				return;
		}
	}

	private toggleExpandedStatus(node: TreeNode): void {
		console.log('toggleExpandedStatus ->', node._expanded);
		node._expanded = !node._expanded;
		setState(this, '_nodes', this.state._nodes);
	}

	private keyAction(key: string | undefined) {
		console.log(key);
	}

	private renderSubtree(expanded: boolean | undefined, node: TreeNode, index: number) {
		return (
			<ul role="group" hidden={!expanded} class="node">
				<li
					key={index}
					role="treeitem"
					aria-expanded={expanded ? 'expanded' : 'collapsed'}
					aria-posinset={index + 1}
					aria-selected={node._expanded ? 'true' : 'false'}
					aria-setsize={node._nodes?.length}
					data-key={node._key}
				>
					{node._nodes.length === 0 && node._key ? (
						<button class="slim" onClick={() => this.keyAction(node._key)} onKeyDown={() => this.keyAction(node._key)}>
							{node._label}
						</button>
					) : (
						<span>{node._label}</span>
					)}
					{node._nodes.length > 0 ? (
						<button class="action" onClick={(event) => this.toggleOnClick(node, event)} onKeyDown={(event) => this.toggleOnKeyDown(node, event)}>
							{node._expanded ? '-' : '+'}
						</button>
					) : null}
				</li>
				{node._nodes &&
					Array.isArray(node._nodes) &&
					node._nodes.map((subNode) => {
						return this.renderSubtree(node._expanded, subNode, index);
					})}
			</ul>
		);
	}

	render() {
		this.init();

		return (
			<ul role="tree" aria-labelledby="tree_label" class="tree">
				{this.state._nodes.length > 0 &&
					this.state._nodes.map((node, index) => {
						return (
							<li
								role="treeitem"
								aria-expanded={this.state._expanded ? 'expanded' : 'collapsed'}
								aria-selected={node._expanded ? 'true' : 'false'}
								hidden={this.state._expanded}
								key={`node${index}`}
								data-key={node._key}
							>
								<span>{node._label}</span>
								<button class="action" onClick={(event) => this.toggleOnClick(node, event)} onKeyDown={(event) => this.toggleOnKeyDown(node, event)}>
									{node._expanded ? '-' : '+'}
								</button>
								{node._nodes.length > 0 &&
									node._nodes?.map((subNode, index) => {
										return this.renderSubtree(node._expanded, subNode, index);
									})}
							</li>
						);
					})}
			</ul>
		);
	}

	public componentWillLoad(): void {
		this.validateExpanded(this._expanded);
		this.validateId(this._id);
		this.validateKey(this._key);
		this.validateLabel(this._label);
		this.validateNodes(this._nodes);
	}
}
