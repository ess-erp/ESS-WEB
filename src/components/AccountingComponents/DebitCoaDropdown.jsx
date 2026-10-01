import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchableSelect from '../ButtonsComponents/SearchableSelect';
import { fetchGetCoaFlatData } from '../../states/AccountingState/Action';

/**
 * DebitCoaDropdown - Reusable dropdown component for selecting Debit COA accounts
 * 
 * Props:
 * @param {number} groupId - The COA group ID to fetch accounts from (not used, fetches all)
 * @param {object} value - The selected COA option {value, label}
 * @param {function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text for the dropdown
 * @param {boolean} errors - Whether to show error state
 * @param {string} errorMessage - Error message to display
 * @param {string} width - Width of the dropdown (default: "100%")
 * @param {boolean} disabled - Whether the dropdown is disabled
 */
const DebitCoaDropdown = ({
    groupId,
    value,
    onChange,
    placeholder = "Select Debit COA...",
    errors = false,
    errorMessage = "",
    width = "100%",
    disabled = false,
}) => {
    const dispatch = useDispatch();

    // Get all COA accounts from Redux (flat list)
    const coaFlatState = useSelector((state) => state.accounting.coaFlatState || {});
    const coaAccounts = coaFlatState.data || [];
    const loading = coaFlatState.loading || false;

    // Fetch all COA accounts on mount
    useEffect(() => {
        dispatch(fetchGetCoaFlatData());
    }, [dispatch]);

    // Prepare options for SearchableSelect - filter by Debit normal balance
    const debitCoaOptions = useMemo(() => {
        if (!Array.isArray(coaAccounts)) return [];
        
        return coaAccounts
            .filter(coa => {
                const normalBalance = coa.normalBalance || coa.NormalBalance;
                return normalBalance === 'Debit';
            })
            .map((coa) => ({
                value: coa.coaChildId || coa.CoaChildId,
                label: `${coa.accountCode || coa.AccountCode} - ${coa.accountName || coa.AccountName}`,
            }));
    }, [coaAccounts]);

    return (
        <SearchableSelect
            options={debitCoaOptions}
            value={value}
            onChange={onChange}
            placeholder={loading ? "Loading..." : placeholder}
            showSearchIcon={true}
            errors={errors}
            errorMessage={errorMessage}
            width={width}
            disabled={disabled || loading}
        />
    );
};

export default DebitCoaDropdown;
