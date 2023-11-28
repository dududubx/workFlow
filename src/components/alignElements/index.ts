import {
  filter,
  forEach,
  isArray,
  sortBy,
  isDefined
} from 'min-dash';

/**
 * @typedef {import('../../model/Types').Element} Element
 *
 * @typedef {import('../modeling/Modeling').default} Modeling
 * @typedef {import('../rules/Rules').default} Rules
 *
 * @typedef {import('../../util/Types').Axis} Axis
 * @typedef {import('../../util/Types').Dimension} Dimension
 *
 * @typedef { 'top' | 'right' | 'bottom' | 'left' | 'center' | 'middle' | 'horizonta' } Alignment
 */

function last(arr) {
  return arr && arr[arr.length - 1];
}

function sortTopOrMiddle(element) {
  return element.y;
}

function sortLeftOrCenter(element) {
  return element.x;
}

/**
 * Sorting functions for different alignments.
 *
 * @type {Record<string, Function>}
 */
var ALIGNMENT_SORTING = {
  left: sortLeftOrCenter,
  center: sortLeftOrCenter,
  right: function (element) {
    return element.x + element.width;
  },
  top: sortTopOrMiddle,
  middle: sortTopOrMiddle,
  bottom: function (element) {
    return element.y + element.height;
  },
  horizonta: sortLeftOrCenter
};

/**
 * @param {Modeling} modeling
 * @param {Rules} rules
 */
export default function AlignElements(this: any, modeling, rules) {
  this._modeling = modeling;
  this._rules = rules;
}

AlignElements.$inject = ['modeling', 'rules'];


/**
 * Get relevant axis and dimension for given alignment.
 *
 * @param {Alignment} type
 *
 * @return { {
 *   axis: Axis;
 *   dimension: Dimension;
 * } }
 */
AlignElements.prototype._getOrientationDetails = function (type) {
  var vertical = ['top', 'bottom', 'middle', 'horizonta'],
    axis = 'x',
    dimension = 'width';

  if (vertical.indexOf(type) !== -1) {
    axis = 'y';
    dimension = 'height';
  }

  return {
    axis: axis,
    dimension: dimension
  };
};

AlignElements.prototype._isType = function (type, types) {
  return types.indexOf(type) !== -1;
};

/**
 * Get point on relevant axis for given alignment.
 *
 * @param {Alignment} type
 * @param {Element[]} sortedElements
 *
 * @return {Partial<Record<Alignment, number>>}
 */
AlignElements.prototype._alignmentPosition = function (type, sortedElements) {
  var modeling = this._modeling
  var orientation = this._getOrientationDetails(type),
    axis = orientation.axis,
    dimension = orientation.dimension,
    alignment = {},
    centers = {},
    hasSharedCenters = false,
    centeredElements,
    firstElement,
    lastElement;

  function getMiddleOrTop(first, last) {
    return Math.round((first[axis] + last[axis] + last[dimension]) / 2);
  }

  if (this._isType(type, ['left', 'top'])) {
    alignment[type] = sortedElements[0][axis];

  } else if (this._isType(type, ['right', 'bottom'])) {
    lastElement = last(sortedElements);

    alignment[type] = lastElement[axis] + lastElement[dimension];

  } else if (this._isType(type, ['center', 'middle'])) {

    // check if there is a center shared by more than one shape
    // if not, just take the middle of the range
    forEach(sortedElements, function (element: any) {
      var center = element[axis] + Math.round(element[dimension] / 2);

      if (centers[center]) {
        centers[center].elements.push(element);
      } else {
        centers[center] = {
          elements: [element],
          center: center
        };
      }
    });

    centeredElements = sortBy(centers, function (center: any) {
      if (center.elements.length > 1) {
        hasSharedCenters = true;
      }

      return center.elements.length;
    });

    if (hasSharedCenters) {
      alignment[type] = last(centeredElements).center;

      return alignment;
    }

    firstElement = sortedElements[0];

    sortedElements = sortBy(sortedElements, function (element: any) {
      return element[axis] + element[dimension];
    });

    lastElement = last(sortedElements);

    alignment[type] = getMiddleOrTop(firstElement, lastElement);
  } else if (this._isType(type, ['horizonta'])) {
    let obj = {
      y: 0,
      x: 0
    }
    let sumWidth = 0;
    sortedElements.map((item, index) => {
      if (index != sortedElements.length - 1) {
        sumWidth += item.width
      }
    })
    obj.x = (last(sortedElements).x - sortedElements[0].x - sumWidth) / (sortedElements.length - 1)

    sortedElements = sortBy(sortedElements, function (element: any) {
      return element[axis];
    });

    let num = Math.floor(sortedElements.length / 2)
    obj.y = sortedElements[num].y + Math.round(sortedElements[num].height / 2)
    alignment[type] = obj
    // forEach(sortedElements, function(element:any, index) {
    //     var delta = {
    //       x: 0,
    //       y: 0
    //     };
    //     delta.y = (obj.y - element.height)
    //    if(index != 0 && index != sortedElements.length - 1){
    //       console.log(index);

    //     //   console.log(sortedElements[index - 1]);
    //       delta.x = obj.x + sortedElements[index - 1].width + sortedElements[index - 1].x
    //     }
    //     console.log( modeling.moveElements([ element ], delta, element.parent));
    //     // modeling.moveElements([ element ], delta, element.parent);
    //   });

  }

  return alignment;
};

/**
 * Align elements on relevant axis for given alignment.
 *
 * @param {Element[]} elements
 * @param {Alignment} type
 */
AlignElements.prototype.trigger = function (elements, type) {
  var modeling = this._modeling,
    allowed;

  // filter out elements which cannot be aligned
  var filteredElements = filter(elements, function (element) {
    return !(element.waypoints || element.host || element.labelTarget);
  });

  // filter out elements via rules
  allowed = this._rules.allowed('elements.align', { elements: filteredElements });
  if (isArray(allowed)) {
    filteredElements = allowed;
  }

  if (filteredElements.length < 2 || !allowed) {
    return;
  }

  var sortFn = ALIGNMENT_SORTING[type];

  var sortedElements = sortBy(filteredElements, sortFn);

  var alignment = this._alignmentPosition(type, sortedElements);
  // console.log(sortedElements, alignment);
  // debugger
  modeling.alignElements(sortedElements, alignment);
  // modeling.prototype.alignElements
};
