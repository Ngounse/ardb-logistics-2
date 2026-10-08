'use client'

import { MerchantT } from "@/app/admin/person/merchant/utility";
import { PersonT } from "@/app/admin/person/person";
import { Copy, Mars, Venus } from "lucide-react";
import { MyBusinessTypeBadge } from "../BusinessTypeBadge";
import { MyHandleCopy } from "../myFunction";
import { Button } from "../ui/button";
import { DetailRow } from "./DetailRow";
import { DetailSection } from "./DetailSection";
import { FormatTimestamp } from "@/lib/function";

type PersonalProps = {
    readonly person: PersonT;
};

export function InformationPersonal({ person: p }: PersonalProps) {
    let dateOfBirth = "";
    if (p.dateOfBirth) {
        dateOfBirth = p.dateOfBirth instanceof Date
            ? p.dateOfBirth.toLocaleDateString()
            : String(p.dateOfBirth);
    }

    return (
        <DetailSection title="Person Information">
            <DetailRow label="ID" value={< >
                <span> {p.id}</span>
                <Button
                    className="ml-2"
                    size="sm"
                    variant="outline"
                    onClick={() => MyHandleCopy(p.id)}  >
                    <Copy className="mr-2 h-4 w-4  " />
                    Copy
                </Button></>
            } />
            <DetailRow label="First Name" value={p.firstName} />
            <DetailRow label="Last Name" value={p.lastName} />
            <DetailRow label="Email" value={p.email} />
            <DetailRow label="Phone" value={p.phone} />
            <DetailRow label="Gender"
                value={<div className="flex items-center gap-2">{p.gender == "M" ? <Mars className="mr-2 h-4 w-4  " color="#4d9ddb" /> : <Venus className="mr-2 h-4 w-4" color="#db4db0" />} {p.gender} </div>} />
            <DetailRow label="Date of Birth" value={dateOfBirth} last={true} />
        </DetailSection>
    );
}


type MerchantProps = {
    readonly merchant: MerchantT;
};

export function InformationMerchant({ merchant: m }: MerchantProps) {

    return (
        <DetailSection title="Merchant Information">
            <DetailRow label="merchantId" value={< >
                <span> {m.merchantId}</span>
                <Button
                    className="ml-2"
                    size="sm"
                    variant="outline"
                    onClick={() => MyHandleCopy(m.merchantId)}  >
                    <Copy className="mr-2 h-4 w-4  " />
                    Copy
                </Button></>
            } />
            <DetailRow label="Shop Name" value={m.shopName} />
            <DetailRow label="Business Type" value={MyBusinessTypeBadge(m.businessType)} last={true} />
        </DetailSection>
    );
}

type AuditProps = {
    readonly item: any;
};

export function InformationAudit({ item: i }: AuditProps) {

    return (
        <DetailSection title="Audit Information">
            <DetailRow label="Created By" value={i?.createdBy} />
            <DetailRow label="Created At" value={FormatTimestamp(i?.createdAt)} />
            <DetailRow label="Updated By" value={i?.updatedBy} />
            <DetailRow label="Updated At" value={FormatTimestamp(i?.updatedAt)} last={true} />
        </DetailSection>
    );
}