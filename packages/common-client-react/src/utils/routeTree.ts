import { IRouteData } from '../interfaces';

export default class RouteTree implements IRouteData {
	public root: IRouteData;
	public addStatus: boolean;

	constructor(node: IRouteData) {
		this.root = node;
	}

	public traverse(callback: () => any) {
		function walk(node: IRouteData) {
			callback(node);
			node.routes.forEach(walk);
		}

		walk(this.root);
	}

	public addNode(path: String, addlData: Object, parentPath: Object) {
		let newNode = {
			path,
			...addlData,
			routes: [],
		};

		this.addStatus = false;

		if (this.root === null) {
			this.root = newNode;
			return;
		}

		this.traverse(node => {
			if (node.path === parentPath) {
				node.routes.push(newNode);
				this.addStatus = true;
			}
		});
	}
}
