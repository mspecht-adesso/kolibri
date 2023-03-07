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
	_key?: string;
	_label: string;
	_nodes: TreeNode[];
};

/**
 * API
 */
type RequiredProps = {
	id: string;
	label: string;
	nodes: Stringified<TreeNode[]>;
};
type OptionalProps = {
	key?: string;
	expanded?: boolean;
};
export type Props = Generic.Element.Members<RequiredProps, OptionalProps>;

type RequiredStates = {
	expanded: boolean;
	id: string;
	label: string;
	nodes: TreeNode[];
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
	@Prop() public _key?: string;

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
		_id: nonce(),
		_label: '',
		_nodes: [],
		_expanded: false,
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

	private toggleOnClick(node: TreeNode, event: MouseEvent): void {
		event.preventDefault();
		event.stopImmediatePropagation();
		console.log('/ ----------------------------------------');
		console.log('toggleOnClick -> _expanded', node._label, node._expanded);
		console.log('---------------------------------------- /');
		this.toggleExpandedStatus(node);
	}

	private toggleOnKeyDown(node: TreeNode, event: KeyboardEvent): void {
		event.preventDefault();
		event.stopImmediatePropagation();
		console.log('/ ----------------------------------------');
		console.log('toggleOnKeyDown -> node', node._label, node._expanded);
		console.log('---------------------------------------- /');
		this.toggleExpandedStatus(node);
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
			<ul hidden={!expanded}>
				<li
					onClick={(event) => this.toggleOnClick(node, event)}
					onKeyDown={(event) => this.toggleOnKeyDown(node, event)}
					key={index}
					role="treeitem"
					aria-expanded={expanded ? 'expanded' : 'collapsed'}
					aria-posinset={index + 1}
					aria-selected={node._expanded ? 'true' : 'false'}
					aria-setsize={node._nodes?.length}
				>
					{node._nodes.length > 0 ? <button>{node._expanded ? '▼' : '▶'}</button> : <button>{node._expanded ? '✓' : '▪'}</button>}
					{node._nodes.length === 0 && node._key ? (
						<button onClick={() => this.keyAction(node._key)} onKeyDown={() => this.keyAction(node._key)}>
							{node._label}
						</button>
					) : (
						<span>{node._label}</span>
					)}
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
			<ul role="tree" aria-labelledby="tree_label">
				{this.state._nodes.length > 0 &&
					this.state._nodes.map((node, index) => {
						return (
							<li
								role="treeitem"
								aria-expanded={this.state._expanded ? 'expanded' : 'collapsed'}
								aria-selected={node._expanded ? 'true' : 'false'}
								onClick={(event) => this.toggleOnClick(node, event)}
								onKeyDown={(event) => this.toggleOnKeyDown(node, event)}
								hidden={this.state._expanded}
								key={`node${index}`}
							>
								<button>{node._expanded ? '▼' : '▶'}</button>
								<span>{node._label}</span>
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