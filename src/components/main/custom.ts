import CustomPalette from '@/components/palette/customPalette'
import CustomRenderer from '@/components/design/customRender'
import CustomContextPadProvider from '@/components/contextPad/customPad'
import AlignElements from '@/components/alignElements'
import CustomElementFactory from '@/components/design/customElemetFactory'
export default {
    __init__: ['paletteProvider', 'customRenderer', 'contextPadProvider', 'alignElements', 'elementFactory'],
    paletteProvider: ['type', CustomPalette],
    customRenderer: ['type', CustomRenderer],
    contextPadProvider: ['type', CustomContextPadProvider],
    alignElements: ['type', AlignElements],
    elementFactory: ['type', CustomElementFactory],
    // connect: ['type', Connect]
    // modeling: [ 'type', Modeling ],
}