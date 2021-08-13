import { IAspect, IConstruct } from '@aws-cdk/core';
export declare class PermissionsBoundaryAspect implements IAspect {
    private readonly arn;
    constructor(permissionBoundaryArn: string);
    visit(node: IConstruct): void;
}
