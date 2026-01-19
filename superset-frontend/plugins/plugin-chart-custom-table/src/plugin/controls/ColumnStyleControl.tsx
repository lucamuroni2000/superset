import { ControlComponentProps, ControlHeader } from '@superset-ui/chart-controls';
import { css, useTheme, GenericDataType } from '@superset-ui/core';
import { ColumnTypeLabel } from '@superset-ui/chart-controls';
import { Icons } from '@superset-ui/core/components/Icons';
import { Popover } from '@superset-ui/core/components/Popover';
import ColorPicker from '@superset-ui/core/components/ColorPicker';
import { ColumnStyleData, AddParameters } from '../types';
import { Col, Button, ColorPickerProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { FONT_FAMILY_OPTIONS } from './constants';


type ColumnStyleControlWrapperProps = ControlComponentProps<Record<string, ColumnStyleData>> & {
    colnames: string[],
    coltypes: GenericDataType[],
    width?: number | string;
    height?: number | string;
};

export default function ColumnStyleControlWrapper({ colnames, coltypes, width, height, onChange, value, ...props }: ColumnStyleControlWrapperProps) {
    const columns = colnames.map((column_name, i) => ({
        name: column_name,
        type: coltypes.at(i)
    }))

    const theme = useTheme();
    const { sizeUnit } = theme;
    const caretWidth = sizeUnit * 6;

    const outerContainerStyle = css({
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: `${sizeUnit}px ${2 * sizeUnit}px`,
        borderBottom: `1px solid ${theme.colorBorderSecondary}`,
        position: 'relative',
        paddingRight: `${caretWidth}px`,
        ':last-child': {
            borderBottom: 'none',
        },
        ':hover': {
            background: theme.colorFillTertiary,
        },
        '> .fa': {
            color: theme.colorTextTertiary,
        },
        ':hover > .fa': {
            color: theme.colorTextSecondary,
        },
    });

    const nameContainerStyle = css({
        display: 'flex',
        alignItems: 'center',
        paddingLeft: sizeUnit,
        flex: 1,
    });

    const nameTextStyle = css({
        paddingLeft: sizeUnit,
    });

    const iconContainerStyle = css({
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        right: 3 * sizeUnit,
        top: 4 * sizeUnit,
        transform: 'translateY(-50%)',
        gap: sizeUnit,
        color: theme.colorTextSecondary,
    });

    const caretIconStyle = css({
        fontSize: `${theme.fontSizeSM}px`,
        fontWeight: theme.fontWeightNormal,
        color: theme.colorIcon,
    });

    return (
        <div
            css={{
                label: {
                    fontSize: theme.fontSizeSM,
                },
            }}
        >
            <ControlHeader {...props} />
            <div
                css={{
                    border: `1px solid ${theme.colorBorder}`,
                    borderRadius: theme.borderRadius,
                }}
            >
                {columns.map((column) => (
                    <Popover
                        title={column.name}
                        content={() => (
                            <ColumnConfigPopover
                                column={column}
                                onChange={(config) => onChange?.({
                                    ...value, [column.name]: config
                                })}
                                width={width}
                                value={value?.[column.name] || {backgroundColor: ['']}}
                            />
                        )}
                        trigger="click"
                        placement="right"
                        style={{ width, height }}
                        className="column-config-popover"
                    >
                        <div css={outerContainerStyle}>
                            <div css={nameContainerStyle}>
                                <ColumnTypeLabel type={column.type} />
                                <span css={nameTextStyle}>{column.name}</span>
                            </div>

                            <div css={iconContainerStyle}>
                                <Icons.RightOutlined css={caretIconStyle} />
                            </div>
                        </div>
                    </Popover>
                ))}
            </div>
        </div>
    )
}

type ColumnConfigPopoverProps = {
    column: { name: string, type: GenericDataType | undefined };
    width?: number | string;
    onChange: (value: ColumnStyleData) => void;
    value: ColumnStyleData;
}

const customPanelRender: (AddParameters<Required<ColorPickerProps>["panelRender"], [onDelete: () => void]>) = (
    _,
    { components: { Picker, Presets } },
    onDelete,
) => (
    <Col>
        <Button onClick={onDelete} color="danger" variant="solid" icon={<Icons.DeleteOutlined />} />
        <Picker />
        <Presets />
    </Col>
);

function ColumnConfigPopover(props: ColumnConfigPopoverProps) {
    const theme = useTheme();

    function setBackgroundColor(index: number, value: string) {
        const newValues = props.value.backgroundColor ? [...props.value.backgroundColor] : []
        newValues[index] = value
        props.onChange({ ...props.value, backgroundColor: newValues })
    }

    function removeBackgroundColor(index: number) {
        const newValues = props.value.backgroundColor ? [...props.value.backgroundColor] : []
        newValues.splice(index, 1)
        props.onChange({ ...props.value, backgroundColor: newValues })
    }

    return (
        <div
            css={{
                label: {
                    color: theme.colorTextLabel,
                    fontSize: theme.fontSizeSM,
                },
            }}
        >
            <ControlHeader label="Background Color" />
            <div 
                css={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    alignItems: 'center',
                    gap: theme.sizeUnit,
                }}
            >
                {props.value.backgroundColor?.map((value, i) =>
                    <ColorPicker 
                        value={value}
                        allowClear 
                        panelRender={(panel, extra) => customPanelRender(panel, extra, () => removeBackgroundColor(i))}  
                        styles={{ popupOverlayInner: { width: props.width ?? 240} }}
                        onChange={(color) => setBackgroundColor(i, color.toHexString())}
                    />
                )}
                <Button icon={<PlusOutlined />} onClick={() => props.onChange({ ...props.value, backgroundColor: props.value.backgroundColor ? [...props.value.backgroundColor, ''] : [''] })}></Button>
            </div>
            <ControlHeader label="Text Color" />
            <ColorPicker allowClear value={props.value.textColor} onChange={(color) => props.onChange({ ...props.value, textColor: color.toHexString() })} />
            <ControlHeader label="Text Font" />
            <Select
                allowClear
                showSearch
                css={{ width: '100%' }}
                value={props.value.textFont}
                onChange={(font) => props.onChange({ ...props.value, textFont: font })}
                options={FONT_FAMILY_OPTIONS}
            />
        </div>
    )
}