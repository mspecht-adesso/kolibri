/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/role-has-required-aria-props */
import { Component, h, Prop, State, Watch } from '@stencil/core';

import { Generic } from '@a11y-ui/core';
import { Stringified } from '../../types/common';
import { nonce } from '../../utils/dev.utils';
import { setState, watchBoolean, watchJsonArrayString, watchNumber, watchString } from '../../utils/prop.validators';

type TreeNode = {
	_expanded?: boolean;
	_id: string;
	_key: string;
	_label: string;
	_nodes: TreeNode[];
	_selected?: boolean;
	_tabIndex?: number;
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
	selected?: boolean;
	tabIndex?: number;
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
	selected: boolean;
	tabIndex: number;
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

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop({ mutable: true, reflect: true }) public _selected?: boolean = false;

	/**
	 * Gibt die ID an, wenn z.B. Aria-Labelledby (Link) verwendet wird.
	 */
	@Prop() public _tabIndex!: number;

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
		_selected: false,
		_tabIndex: 0,
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

	@Watch('_selected')
	public validateSelected(value?: boolean): void {
		watchBoolean(this, '_selected', value);
	}

	@Watch('_tabIndex')
	public validateTabIndex(value?: number): void {
		watchNumber(this, '_tabIndex', value);
	}

	private init() {
		console.log('==========');
		console.log('initialize tree-component -> _nodes');
		console.log(this.state._nodes);
		console.log(this._nodes);
		console.log('----------');
		let newTree: TreeNode[] = this.state._nodes;

		newTree = this.addIndexToTree(newTree, '_tabIndex');
		newTree = this.addKeyValueToTree(newTree, '_expanded', false);
		newTree = this.addKeyValueToTree(newTree, '_selected', false);

		console.log('newTree');
		console.log(newTree);
		console.log('==========');

		setState(this, '_nodes', this.state._nodes);
	}

	private addIndexToTree(tree: TreeNode[], key: string) {
		const newTree: TreeNode[] = tree.map((node: TreeNode, index: number) => ({ ...node, [key]: index, _nodes: this.addIndexToTree(node._nodes, key) }));

		return newTree;
	}

	private addKeyValueToTree(tree: TreeNode[], key: string, value: boolean | number | string) {
		const newTree: TreeNode[] = tree.map((node: TreeNode) => ({ ...node, [key]: value, _nodes: this.addKeyValueToTree(node._nodes, key, value) }));

		return newTree;
	}

	private setFocusToItem(treeitem: TreeNode) {
		console.log('---------- setFocusToItem ----------', treeitem._key, treeitem._expanded, treeitem._selected, treeitem._tabIndex);
		for (let i = 0; i < this.state._nodes.length; i++) {
			const ti = this.state._nodes[i];
			if (ti === treeitem) {
				console.log('----- ti equals treeitem ->', ti === treeitem, ti._tabIndex);
				/*
				ti.tabIndex = 0;
				ti.focus();
			} 
			else {
				ti.tabIndex = -1;
				*/
			}
		}
	}

	private setFocusToNextItem(currentItem: TreeNode) {
		console.log('---------- setFocusToNextItem ----------', currentItem._key, currentItem._nodes.length);
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
		this.toggleSelectedStatus(node);
	}

	private toggleOnKeyDown(node: TreeNode, event: KeyboardEvent): void {
		console.log('---------- toggleOnKeyDown ---------- -> key', event.key);
		console.log(node);
		event.preventDefault();
		event.stopImmediatePropagation();

		switch (event.key) {
			case 'Tab':
				console.log('Tab', node._expanded, node._selected, node._nodes.length);
				// this.toggleExpandedStatus(node);
				break;
			case 'Enter':
				console.log('Enter', node._expanded, node._selected, node._nodes.length);
				this.toggleExpandedStatus(node);
				this.toggleSelectedStatus(node);
				this.setFocusToItem(node);
				break;
			case 'ArrowLeft':
				console.log('ArrowLeft', node._expanded, node._selected, node._nodes.length);
				if (!node._expanded) {
					this.setFocusToItem(node);
				} else {
					this.toggleExpandedStatus(node);
					this.toggleSelectedStatus(node);
					this.setFocusToPreviousItem(node);
				}
				break;
			case 'ArrowRight':
				console.log('ArrowRight', node._expanded, node._selected, node._nodes.length);
				if (!node._expanded) {
					this.toggleExpandedStatus(node);
					this.toggleSelectedStatus(node);
					this.setFocusToItem(node);
				} else {
					this.setFocusToNextItem(node);
				}
				break;
			case 'ArrowUp':
				console.log('ArrowUp', node._expanded, node._selected, node._nodes.length);
				this.setFocusToPreviousItem(node);
				break;
			case 'ArrowDown':
				console.log('ArrowDown', node._expanded, node._selected, node._nodes.length);
				this.setFocusToNextItem(node);
				break;
			default:
				return;
		}
	}

	private toggleExpandedStatus(node: TreeNode): void {
		node._expanded = !node._expanded;
		setState(this, '_nodes', this.state._nodes);
	}

	private toggleSelectedStatus(node: TreeNode): void {
		node._selected = !node._selected;
		setState(this, '_nodes', this.state._nodes);
	}

	private clickAction(key: string | undefined, event: MouseEvent) {
		event.preventDefault();
		event.stopImmediatePropagation();

		console.log(key);
	}

	private keyAction(key: string | undefined, event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				event.stopImmediatePropagation();
				console.log(key);
				break;
			default:
				console.log('Sorry, but no event on this key:', event.key);
				return;
		}
	}

	private renderSubtree(expanded: boolean | undefined, node: TreeNode, index: number) {
		return (
			<ul role="group" hidden={!expanded} class="node">
				<li
					key={index}
					role="treeitem"
					aria-expanded={expanded ? 'expanded' : 'collapsed'}
					aria-hidden={expanded}
					aria-label={node._label}
					aria-posinset={index + 1}
					aria-selected={node._expanded ? 'true' : 'false'}
					aria-setsize={node._nodes?.length}
					data-key={node._key}
				>
					{node._key ? (
						<button class="slim" onClick={(event) => this.clickAction(node._key, event)} onKeyDown={(event) => this.keyAction(node._key, event)}>
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
		return (
			<ul role="tree" aria-labelledby="tree_label" class="tree">
				{this.state._nodes.length > 0 &&
					this.state._nodes.map((node, index) => {
						return (
							<li
								role="treeitem"
								aria-expanded={node._expanded ? 'expanded' : 'collapsed'}
								aria-hidden={node._expanded}
								aria-label={node._label}
								aria-posinset={index + 1}
								aria-selected={node._expanded ? 'true' : 'false'}
								aria-setsize={node._nodes?.length}
								hidden={this.state._expanded}
								key={`node${index}`}
								data-key={node._key}
							>
								{node._key ? (
									<button class="slim" onClick={(event) => this.clickAction(node._key, event)} onKeyDown={(event) => this.keyAction(node._key, event)}>
										{node._label}
									</button>
								) : (
									<span>{node._label}</span>
								)}
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
		this.validateSelected(this._selected);
		this.validateTabIndex(this._tabIndex);

		this.init();
	}
}
